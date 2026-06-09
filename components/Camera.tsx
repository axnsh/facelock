"use client";

import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

type Props = {
  webcamRef: React.RefObject<any>;
};

export default function Camera({ webcamRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const modelRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let canceled = false;

    const loadModel = async () => {
      try {
        const blazeface = await import("@tensorflow-models/blazeface");
        await import("@tensorflow/tfjs");
        modelRef.current = await blazeface.load();
      } catch (error) {
        console.error("Unable to load face detection model", error);
      } finally {
        if (!canceled) setLoading(false);
      }
    };

    loadModel();

    const drawLoop = async () => {
      if (canceled) return;

      const video = webcamRef.current?.video as HTMLVideoElement | undefined;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

      if (video && canvas && ctx && modelRef.current) {
        const width = video.videoWidth || video.clientWidth || 500;
        const height = video.videoHeight || video.clientHeight || 320;

        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }

        ctx.clearRect(0, 0, width, height);

        try {
          const predictions = await modelRef.current.estimateFaces(video, false);
          if (predictions.length > 0) {
            const topLeft = predictions[0].topLeft as [number, number];
            const bottomRight = predictions[0].bottomRight as [number, number];
            const x = topLeft[0];
            const y = topLeft[1];
            const boxWidth = bottomRight[0] - topLeft[0];
            const boxHeight = bottomRight[1] - topLeft[1];

            ctx.strokeStyle = "#4ade80";
            ctx.lineWidth = 4;
            ctx.fillStyle = "rgba(74, 222, 128, 0.18)";
            ctx.strokeRect(x, y, boxWidth, boxHeight);
            ctx.fillRect(x, y, boxWidth, boxHeight);
          }
        } catch (error) {
          console.error("Face detection overlay failed", error);
        }
      }

      animationRef.current = requestAnimationFrame(drawLoop);
    };

    animationRef.current = requestAnimationFrame(drawLoop);

    return () => {
      canceled = true;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [webcamRef]);

  return (
    <div className="relative w-[500px] h-[320px] rounded overflow-hidden bg-black">
      <Webcam
        audio={false}
        mirrored
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: "user" }}
        className="absolute inset-0 w-full h-full object-cover"
        ref={webcamRef}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-sm">
          Loading face detection...
        </div>
      )}
    </div>
  );
}
