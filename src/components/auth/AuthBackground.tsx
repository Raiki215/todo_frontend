"use client";

import { useEffect, useRef } from "react";
import { useAuthTheme } from "@/hooks/useAuthTheme";

export default function AuthBackground() {
  const { theme } = useAuthTheme();
  const vantaRef = useRef<HTMLDivElement | null>(null);
  const vantaEffectRef = useRef<any>(null);

  // Vanta Fog 初期化
  useEffect(() => {
    let mounted = true;

    const hexToNum = (hex: string) => {
      try {
        return parseInt(hex.replace("#", "0x"));
      } catch {
        return 0xffffff;
      }
    };

    (async () => {
      try {
        const prefersReduce = window.matchMedia?.(
          "(prefers-reduced-motion: reduce)"
        )?.matches;
        if (prefersReduce) return;

        const THREE = await import("three");
        const VANTA = await import("vanta/dist/vanta.fog.min");

        if (!mounted || !vantaRef.current) return;

        if (vantaEffectRef.current) {
          vantaEffectRef.current.destroy();
          vantaEffectRef.current = null;
        }

        const createVanta = (VANTA as any).default;
        vantaEffectRef.current = createVanta({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          highlightColor: hexToNum(theme.fog.highlight),
          midtoneColor: hexToNum(theme.fog.midtone),
          lowlightColor: hexToNum(theme.fog.lowlight),
          baseColor: hexToNum(theme.fog.base),
          blurFactor: theme.fog.blur,
          speed: theme.fog.speed,
          zoom: 1.0,
        });
      } catch (e) {
        console.error("Vanta init error (auth)", e);
      }
    })();

    return () => {
      mounted = false;
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, [
    theme.fog.highlight,
    theme.fog.midtone,
    theme.fog.lowlight,
    theme.fog.base,
    theme.fog.blur,
    theme.fog.speed,
  ]);

  return (
    <div
      ref={vantaRef}
      className="absolute inset-0 -z-10"
      style={{
        background:
          "radial-gradient(1200px 600px at 10% 10%, #ffffff 0%, #e8f1ff 30%, #dfe9ff 60%, #cfd6ff 100%)",
      }}
      aria-hidden
    />
  );
}
