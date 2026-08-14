import { useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export default function InteractiveBackground() {
  const { mousePos } = useApp();
  const glowRef = useRef(null);
  const animPos = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  useEffect(() => {
    const lerp = (a, b, t) => a + (b - a) * t;

    function animate() {
      animPos.current.x = lerp(animPos.current.x, mousePos.x, 0.08);
      animPos.current.y = lerp(animPos.current.y, mousePos.y, 0.08);

      if (glowRef.current) {
        glowRef.current.style.background = `
          radial-gradient(
            700px circle at ${animPos.current.x}px ${animPos.current.y}px,
            rgba(200, 169, 107, 0.09),
            rgba(13, 32, 53, 0.05) 48%,
            transparent 70%
          )
        `;
      }

      rafId.current = requestAnimationFrame(animate);
    }

    rafId.current = requestAnimationFrame(animate);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [mousePos]);

  return (
    <>
      {/* Static ambient gradients */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: `
            radial-gradient(ellipse 65% 50% at 0% 100%, rgba(13, 32, 53, 0.08), transparent),
            radial-gradient(ellipse 55% 40% at 100% 0%, rgba(200, 169, 107, 0.06), transparent),
            radial-gradient(ellipse 35% 25% at 50% 50%, rgba(13, 32, 53, 0.03), transparent)
          `,
        }}
      />

      {/* Dynamic cursor-tracking glow */}
      <div
        ref={glowRef}
        className="fixed inset-0 pointer-events-none transition-none"
        style={{ zIndex: 1 }}
      />

      {/* Subtle noise overlay for depth */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          zIndex: 2,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
}

