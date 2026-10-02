"use client";

import { useEffect, useState } from "react";

/**
 * `true` once the page has scrolled more than `threshold` px (default 80).
 * For the header: transparent over the hero, ivory + hairline afterwards.
 *
 * There is no scroll listener. The hook places an invisible sentinel of
 * `threshold` px at the top of the document and watches it with an
 * IntersectionObserver, so React state changes only when the boolean flips,
 * never per scroll event, and no layout is read.
 *
 * It is `false` on the server and for the first paint. It is NOT gated on
 * reduced motion: the header must change colour to stay legible whatever the
 * motion preference. Keep the visual change in CSS (`transition-opacity
 * duration-hover`, a fade under 200ms, which reduced motion permits).
 */
export function useScrolled(threshold = 80): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = [
      "position:absolute",
      "top:0",
      "left:0",
      "width:1px",
      `height:${Math.max(1, Math.round(threshold))}px`,
      "pointer-events:none",
      "visibility:hidden",
    ].join(";");
    document.body.appendChild(sentinel);

    const observer = new IntersectionObserver((entries) => {
      const latest = entries[entries.length - 1];
      if (latest !== undefined) setScrolled(!latest.isIntersecting);
    });
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, [threshold]);

  return scrolled;
}
