"use client";

import { useCallback, useRef, useState } from "react";

// Cache TTS blob URLs so we don't re-fetch the same text
const ttsCache = new Map<string, string>();

interface AudioButtonProps {
  src: string | null;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export default function AudioButton({ src, label, size = "md" }: AudioButtonProps) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sizeClasses = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-11 w-11",
  };

  const iconSize = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const playAudio = useCallback(async (audioSrc: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const audio = new Audio(audioSrc);
    audioRef.current = audio;
    setPlaying(true);
    audio.onended = () => setPlaying(false);
    audio.onerror = () => setPlaying(false);
    await audio.play();
  }, []);

  const play = useCallback(async () => {
    if (playing || loading) return;

    // 1. If pre-generated audio file exists, use it
    if (src) {
      try {
        await playAudio(src);
        return;
      } catch {
        // Fall through to TTS
      }
    }

    // 2. Use our /api/tts endpoint (Google Cloud TTS with proper Vietnamese voices)
    const text = label || "";
    if (!text) return;

    // Check cache first
    const cached = ttsCache.get(text);
    if (cached) {
      try {
        await playAudio(cached);
        return;
      } catch {
        ttsCache.delete(text);
      }
    }

    // Fetch from TTS API
    setLoading(true);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        ttsCache.set(text, blobUrl);
        setLoading(false);
        await playAudio(blobUrl);
        return;
      }
    } catch {
      // Fall through to browser fallback
    }
    setLoading(false);

    // 3. Last resort: browser Web Speech API
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "vi-VN";
      utterance.rate = 0.85;
      setPlaying(true);
      utterance.onend = () => setPlaying(false);
      utterance.onerror = () => setPlaying(false);
      speechSynthesis.speak(utterance);
    }
  }, [src, label, playing, loading, playAudio]);

  return (
    <button
      onClick={play}
      disabled={playing || loading}
      className={`${sizeClasses[size]} inline-flex items-center justify-center rounded-full bg-primary/10 text-primary transition-all hover:bg-primary/20 disabled:opacity-70 ${
        playing ? "animate-pulse" : ""
      } ${loading ? "animate-spin" : ""}`}
      aria-label={`Play audio: ${label || "pronunciation"}`}
      title={label ? `Listen: ${label}` : "Listen"}
    >
      {loading ? (
        <svg className={iconSize[size]} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4m0 12v4m-7.07-3.93l2.83-2.83m8.48-8.48l2.83-2.83M2 12h4m12 0h4m-3.93 7.07l-2.83-2.83M7.76 7.76L4.93 4.93" />
        </svg>
      ) : playing ? (
        <svg className={iconSize[size]} viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 8.5v7a4.47 4.47 0 002.5-3.5zM14 3.23v2.06a6.51 6.51 0 010 13.42v2.06A8.5 8.5 0 0014 3.23z" />
        </svg>
      ) : (
        <svg className={iconSize[size]} viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 9v6h4l5 5V4L7 9H3z" />
        </svg>
      )}
    </button>
  );
}
