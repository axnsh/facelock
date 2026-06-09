"use client";

import { useEffect, useRef, useState } from "react";

import Landing from "@/components/Landing";
import Register from "@/components/Register";
import Success from "@/components/Success";
import Failure from "@/components/Failure";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Verify from "@/components/Verify";

const FACE_HASH_STORAGE_KEY = "faceLockRegistered";
const THEME_STORAGE_KEY = "faceLockTheme";
const HASH_SIZE = 16;
const MATCH_THRESHOLD = 70;

let faceModel: any | null = null;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

async function getFaceModel() {
  if (faceModel) return faceModel;

  const blazeface = await import("@tensorflow-models/blazeface");
  await import("@tensorflow/tfjs");
  faceModel = await blazeface.load();
  return faceModel;
}

async function getImageHash(dataUrl: string) {
  const image = await loadImage(dataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = HASH_SIZE;
  canvas.height = HASH_SIZE;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to create canvas context");
  }

  const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
  const sourceX = (image.naturalWidth - sourceSize) / 2;
  const sourceY = (image.naturalHeight - sourceSize) / 2;

  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceSize,
    sourceSize,
    0,
    0,
    HASH_SIZE,
    HASH_SIZE
  );

  const pixels = context.getImageData(0, 0, HASH_SIZE, HASH_SIZE).data;

  const values: number[] = [];
  let total = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const grayscale = 0.299 * r + 0.587 * g + 0.114 * b;
    values.push(grayscale);
    total += grayscale;
  }

  const average = total / values.length;

  return values.map((value) => (value >= average ? "1" : "0")).join("");
}

async function detectFaces(dataUrl: string) {
  const image = await loadImage(dataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to create canvas context");
  }

  context.drawImage(image, 0, 0);

  try {
    const model = await getFaceModel();
    const predictions = await model.estimateFaces(canvas, false);
    return predictions;
  } catch (error) {
    console.warn("Face detection failed via Blazeface, falling back to heuristic", error);
  }

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const width = canvas.width;
  const height = canvas.height;
  const tile = Math.min(128, width, height);
  const startX = Math.floor((width - tile) / 2);
  const startY = Math.floor((height - tile) / 2);

  let edgeCount = 0;
  let total = 0;

  for (let y = startY; y < startY + tile - 1; y += 4) {
    for (let x = startX; x < startX + tile - 1; x += 4) {
      const idx = (y * width + x) * 4;
      const r = imageData[idx];
      const g = imageData[idx + 1];
      const b = imageData[idx + 2];
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;

      const rightIdx = (y * width + x + 1) * 4;
      const belowIdx = ((y + 1) * width + x) * 4;
      const rR = imageData[rightIdx];
      const gR = imageData[rightIdx + 1];
      const bR = imageData[rightIdx + 2];
      const grayRight = 0.299 * rR + 0.587 * gR + 0.114 * bR;

      const rB = imageData[belowIdx];
      const gB = imageData[belowIdx + 1];
      const bB = imageData[belowIdx + 2];
      const grayBelow = 0.299 * rB + 0.587 * gB + 0.114 * bB;

      if (Math.abs(gray - grayRight) + Math.abs(gray - grayBelow) > 40) {
        edgeCount += 1;
      }
      total += 1;
    }
  }

  return edgeCount / total > 0.02 ? [{}] : [];
}

function compareHashes(hashA: string, hashB: string) {
  let diff = 0;

  for (let i = 0; i < hashA.length && i < hashB.length; i += 1) {
    if (hashA[i] !== hashB[i]) diff += 1;
  }

  return diff;
}

export default function Home() {
  const webcamRef = useRef<any>(null);
  const [screen, setScreen] = useState<
    "landing" |
    "register" |
    "verify" |
    "success" |
    "failure"
  >("landing");
  const [registeredHash, setRegisteredHash] = useState<string | null>(null);
  const [latestScreenshot, setLatestScreenshot] = useState<string | null>(null);
  const [latestPredictions, setLatestPredictions] = useState<any[]>([]);
  const [failureMessage, setFailureMessage] = useState<string>("Access Denied");
  const [failureVariant, setFailureVariant] = useState<"error" | "warning">("error");
  const [failureRetryScreen, setFailureRetryScreen] = useState<"register" | "verify">("verify");
  const failureRetryScreenRef = useRef<"register" | "verify">("verify");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = localStorage.getItem(FACE_HASH_STORAGE_KEY);
    if (stored) setRegisteredHash(stored);

    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as "dark" | "light" | null;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const updateFailureRetryScreen = (screen: "register" | "verify") => {
    setFailureRetryScreen(screen);
    failureRetryScreenRef.current = screen;
  };

  const resetFaceMemory = () => {
    localStorage.removeItem(FACE_HASH_STORAGE_KEY);
    setRegisteredHash(null);
    setLatestScreenshot(null);
    setLatestPredictions([]);
    setFailureMessage("Access Denied");
    setFailureVariant("error");
    updateFailureRetryScreen("register");
  };

  const handleRegister = async () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (!screenshot) {
      setFailureVariant("warning");
      setFailureMessage(
        "No face detected. Please make sure your face is visible in the camera shot."
      );
      updateFailureRetryScreen("register");
      setScreen("failure");
      return;
    }

    setLatestScreenshot(screenshot);

    try {
      const predictions = await detectFaces(screenshot);
      setLatestPredictions(predictions);
      if (predictions.length === 0) {
        console.warn("No face detected during registration");
        setFailureVariant("warning");
        setFailureMessage(
          "No face detected. Please make sure your face is visible in the camera shot."
        );
        updateFailureRetryScreen("register");
        setScreen("failure");
        return;
      }

      const hash = await getImageHash(screenshot);
      localStorage.setItem(FACE_HASH_STORAGE_KEY, hash);
      setRegisteredHash(hash);
      setFailureVariant("error");
      setFailureMessage("Access Denied");
      updateFailureRetryScreen("verify");
      setScreen("verify");
    } catch (error) {
      console.error("Registration failed", error);
      setFailureVariant("error");
      setFailureMessage("Access Denied");
      updateFailureRetryScreen("register");
      setScreen("failure");
    }
  };

  const handleVerify = async () => {
    if (!registeredHash) {
      setFailureVariant("error");
      setFailureMessage("Access Denied");
      updateFailureRetryScreen("register");
      setScreen("failure");
      return;
    }

    const screenshot = webcamRef.current?.getScreenshot();
    if (!screenshot) {
      setFailureVariant("warning");
      setFailureMessage(
        "No face detected. Please make sure your face is visible in the camera shot."
      );
      updateFailureRetryScreen("verify");
      setScreen("failure");
      return;
    }

    setLatestScreenshot(screenshot);

    try {
      const predictions = await detectFaces(screenshot);
      setLatestPredictions(predictions);
      if (predictions.length === 0) {
        console.warn("No face detected during verification");
        setFailureVariant("warning");
        setFailureMessage(
          "No face detected. Please make sure your face is visible in the camera shot."
        );
        updateFailureRetryScreen("verify");
        setScreen("failure");
        return;
      }

      const hash = await getImageHash(screenshot);
      const difference = compareHashes(hash, registeredHash);
      if (difference <= MATCH_THRESHOLD) {
        setScreen("success");
      } else {
        setFailureVariant("error");
        setFailureMessage("Access Denied");
        updateFailureRetryScreen("verify");
        setScreen("failure");
      }
    } catch (error) {
      console.error("Verification failed", error);
      setFailureVariant("error");
      setFailureMessage("Access Denied");
      updateFailureRetryScreen("verify");
      setScreen("failure");
    }
  };

  const handleTryAgain = () => {
    setFailureVariant("error");
    setFailureMessage("Access Denied");
    setScreen(failureRetryScreenRef.current);
  };

  const handleGoBack = () => {
    resetFaceMemory();
    setScreen("landing");
  };

  const handleToggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col">
      <Navbar theme={theme} onToggleTheme={handleToggleTheme} />

      {screen === "landing" && (
        <Landing
          onStart={() => {
            resetFaceMemory();
            setScreen("register");
          }}
        />
      )}

      {screen === "register" && (
        <Register webcamRef={webcamRef} onRegister={handleRegister} />
      )}

      {screen === "verify" && (
        <Verify webcamRef={webcamRef} onVerify={handleVerify} />
      )}

      {screen === "success" && (
        <Success onTryAgain={handleTryAgain} onGoBack={handleGoBack} />
      )}
      {screen === "failure" && (
        <Failure
          onTryAgain={handleTryAgain}
          onGoBack={handleGoBack}
          message={failureMessage}
          variant={failureVariant}
        />
      )}

      <Footer />
    </main>
  );
}
