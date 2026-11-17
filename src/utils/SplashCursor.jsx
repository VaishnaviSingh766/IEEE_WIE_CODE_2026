import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function SplashCursor({
  pixelCount = 30,
  pixelSize = 8,
  trailColor = "#ffffff",
  fadeOut = true,
  trailSpacing = 15,
  stiffness = 0.2,
  damping = 0.5,
  pixelShape = "square",
  blur = 0,
  scaleVariation = true,
  trailDuration = 5,
  trailStyle = "solid",
  animationPreset = "none",
  presetSpeed = 1,
}) {
  const layerRef = useRef(null);

  const count = Math.max(1, Math.round(pixelCount));

  useEffect(() => {
    const layer = layerRef.current;

    if (!layer) return undefined;

    const pointerQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    );

    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const pixels = Array.from(layer.children);

    const points = Array.from({ length: count }, () => ({
      x: -1000,
      y: -1000,
      vx: 0,
      vy: 0,
    }));

    const cursor = {
      x: -1000,
      y: -1000,
    };

    let enabled =
      pointerQuery.matches && !motionQuery.matches;

    let frameId = 0;
    let lastFrame = 0;
    let lastMove = 0;
    let animationTime = 0;
    let activity = 0;
    let seen = false;
    let inside = false;

    const hidePixels = () => {
      pixels.forEach((pixel) => {
        pixel.style.opacity = "0";
      });
    };

    const animate = (now) => {
      frameId = 0;

      if (!enabled) return;

      const dt = lastFrame
        ? Math.min((now - lastFrame) / 1000, 0.05)
        : 1 / 60;

      lastFrame = now;

      animationTime += dt * presetSpeed;

      const moving = inside && now - lastMove < 100;
      const targetActivity = moving ? 1 : 0;

      const fadeTime = moving
        ? 0.2
        : Math.max(0.1, trailDuration);

      const activityStep = dt / fadeTime;

      if (activity < targetActivity) {
        activity = Math.min(
          targetActivity,
          activity + activityStep
        );
      } else {
        activity = Math.max(
          targetActivity,
          activity - activityStep
        );
      }

      // Match the original spring physics at roughly 60fps.
      const steps = Math.max(1, Math.round(dt * 60));

      for (let step = 0; step < steps; step++) {
        points.forEach((point, index) => {
          const previous =
            index === 0 ? cursor : points[index - 1];

          const dx = previous.x - point.x;
          const dy = previous.y - point.y;

          const distance = Math.hypot(dx, dy);

          point.vx += dx * stiffness;
          point.vy += dy * stiffness;

          point.vx *= damping;
          point.vy *= damping;

          point.x += point.vx;
          point.y += point.vy;

          if (index > 0 && distance > trailSpacing) {
            const ratio =
              (distance - trailSpacing) / distance;

            point.x += dx * ratio * 0.5;
            point.y += dy * ratio * 0.5;
          }
        });
      }

      points.forEach((point, index) => {
        const pixel = pixels[index];
        const progress = index / count;
        const indexOffset = index * 0.1;

        let opacity = fadeOut ? 1 - progress : 1;

        let scale = scaleVariation
          ? 1 - progress * 0.5
          : 1;

        let color = trailColor;

        opacity *= activity;
        scale *= activity;

        switch (animationPreset) {
          case "fadeInOut":
            opacity *=
              (Math.sin(animationTime + indexOffset) + 1) /
              2;
            break;

          case "pulse":
            scale *=
              1 +
              Math.sin(animationTime + indexOffset) * 0.3;
            break;

          case "strobe":
            opacity *=
              Math.sin(animationTime * 5 + indexOffset) > 0
                ? 1
                : 0.2;
            break;

          case "rainbow": {
            const hue =
              (animationTime * 50 + index * 10) % 360;

            color = `hsl(${hue}, 70%, 60%)`;
            break;
          }

          case "wave": {
            const wave =
              (Math.sin(
                animationTime + indexOffset * 2
              ) +
                1) /
              2;

            opacity *= 0.3 + wave * 0.7;
            scale *= 0.7 + wave * 0.6;
            break;
          }

          default:
            break;
        }

        let visible = true;

        if (trailStyle === "dashed") {
          visible = index % 5 < 3;
        } else if (trailStyle === "dotted") {
          visible = index % 3 === 0;
        }

        let offsetX = 0;
        let offsetY = 0;

        if (
          index > 0 &&
          (trailStyle === "wave" ||
            trailStyle === "zigzag")
        ) {
          const previous = points[index - 1];

          const dx = point.x - previous.x;
          const dy = point.y - previous.y;
          const length = Math.hypot(dx, dy);

          if (length > 0) {
            const offset =
              trailStyle === "wave"
                ? Math.sin(index * 0.3) * pixelSize * 2
                : (index % 2 === 0 ? 1 : -1) *
                  pixelSize *
                  1.5;

            offsetX = (-dy / length) * offset;
            offsetY = (dx / length) * offset;
          }
        }

        pixel.style.opacity =
          visible && opacity >= 0.01
            ? String(opacity)
            : "0";

        pixel.style.backgroundColor = color;

        pixel.style.transform = [
          `translate3d(${point.x + offsetX}px,`,
          `${point.y + offsetY}px, 0)`,
          "translate(-50%, -50%)",
          `scale(${scale})`,
        ].join(" ");
      });

      if (activity > 0 || moving) {
        frameId = requestAnimationFrame(animate);
      } else {
        hidePixels();
        lastFrame = 0;
      }
    };

    const wake = () => {
      if (!frameId && enabled) {
        lastFrame = 0;
        frameId = requestAnimationFrame(animate);
      }
    };

    const onMove = (event) => {
      if (!enabled || event.pointerType !== "mouse") {
        return;
      }

      cursor.x = event.clientX;
      cursor.y = event.clientY;

      if (!seen) {
        points.forEach((point) => {
          point.x = cursor.x;
          point.y = cursor.y;
          point.vx = 0;
          point.vy = 0;
        });

        seen = true;
      }

      inside = true;
      lastMove = performance.now();

      wake();
    };

    const onLeave = () => {
      inside = false;
      lastMove = 0;
      wake();
    };

    const updateAvailability = () => {
      enabled =
        pointerQuery.matches && !motionQuery.matches;

      cancelAnimationFrame(frameId);

      frameId = 0;
      lastFrame = 0;
      activity = 0;
      seen = false;
      inside = false;

      hidePixels();
    };

    window.addEventListener("pointermove", onMove, {
      passive: true,
    });

    document.documentElement.addEventListener(
      "pointerleave",
      onLeave
    );

    window.addEventListener("blur", onLeave);

    pointerQuery.addEventListener(
      "change",
      updateAvailability
    );

    motionQuery.addEventListener(
      "change",
      updateAvailability
    );

    return () => {
      cancelAnimationFrame(frameId);

      window.removeEventListener("pointermove", onMove);

      document.documentElement.removeEventListener(
        "pointerleave",
        onLeave
      );

      window.removeEventListener("blur", onLeave);

      pointerQuery.removeEventListener(
        "change",
        updateAvailability
      );

      motionQuery.removeEventListener(
        "change",
        updateAvailability
      );
    };
  }, [
    count,
    pixelSize,
    trailColor,
    fadeOut,
    trailSpacing,
    stiffness,
    damping,
    pixelShape,
    blur,
    scaleVariation,
    trailDuration,
    trailStyle,
    animationPreset,
    presetSpeed,
  ]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={layerRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 2147483647,
        overflow: "hidden",
      }}
    >
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            display: "block",
            width: `${pixelSize}px`,
            height: `${pixelSize}px`,
            backgroundColor: trailColor,
            borderRadius:
              pixelShape === "circle" ? "50%" : "0",
            opacity: 0,
            imageRendering: "pixelated",
            filter: blur > 0 ? `blur(${blur}px)` : "none",
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>,
    document.body
  );
}