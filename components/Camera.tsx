"use client";

import Webcam from "react-webcam";

type Props = {
  webcamRef: React.RefObject<any>;
};

export default function Camera({ webcamRef }: Props) {
  return (
    <Webcam
      audio={false}
      mirrored
      screenshotFormat="image/jpeg"
      videoConstraints={{ facingMode: "user" }}
      className="w-[500px] h-[320px] rounded"
      ref={webcamRef}
    />
  );
}
