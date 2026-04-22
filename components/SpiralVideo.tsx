"use client";

import { useEffect, useState } from "react";

// Transparent WebM works on Chrome/Firefox/Edge (VP9 + alpha).
// Safari (iOS & macOS) can decode WebM but strips transparency — so we
// serve an opaque H.264 MP4 flattened onto a dark-green background that
// matches the hero overlay.
export default function SpiralVideo() {
  const [src, setSrc] = useState("/spiral.webm");

  useEffect(() => {
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(ua);
    if (isIOS || isSafari) setSrc("/spiral.mp4");
  }, []);

  return (
    <video
      key={src}
      src={src}
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
