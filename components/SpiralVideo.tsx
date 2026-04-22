"use client";

import { useEffect, useState } from "react";

// Transparent WebM works on Chrome/Firefox/Edge (VP9 + alpha).
// Safari (iOS & macOS) strips the alpha channel — the opaque MP4 fallback
// looks poor against the grass texture, so on Safari/iOS we render nothing.
export default function SpiralVideo() {
  const [hidden, setHidden] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(ua);
    if (isIOS || isSafari) setHidden(true);
    setReady(true);
  }, []);

  if (!ready || hidden) return null;

  return (
    <video
      src="/spiral.webm"
      width={480}
      height={440}
      autoPlay
      muted
      playsInline
      preload="auto"
      aria-label="Clubes do Brasileirão em espiral"
      className="w-full max-w-[480px] h-auto"
      style={{ background: "transparent" }}
    />
  );
}
