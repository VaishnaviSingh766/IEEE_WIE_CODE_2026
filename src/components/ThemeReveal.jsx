
import { useCallback, useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import "../cssfiles/EventReveal.css";
import Background from "../utils/Background";

const SCRATCH_THRESHOLD = 5;

export default function EventReveal() {
  const canvasRef = useRef(null);
  const cardRef = useRef(null);
  const isScratching = useRef(false);
  const lastPoint = useRef(null);
  const revealedRef = useRef(false);
  const checkFrame = useRef(null);

  const [progress, setProgress] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [isScratchingUI, setIsScratchingUI] = useState(false);

  // Draw the silver foil onto the canvas.
  const drawFoil = useCallback(() => {
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card || revealedRef.current) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, width, height);

    // Metallic silver foil with a brushed texture.
    const gradient = ctx.createLinearGradient(
      0, 0, width, height
    );

    gradient.addColorStop(0, "#85818a");
    gradient.addColorStop(0.18, "#e5e1e5");
    gradient.addColorStop(0.36, "#a6a2aa");
    gradient.addColorStop(0.55, "#f1edf0");
    gradient.addColorStop(0.73, "#99949d");
    gradient.addColorStop(1, "#d3cfd5");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Fine metallic scratches.
    for (let i = 0; i < 850; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const length = 3 + Math.random() * 35;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(
        Math.min(width, x + length),
        Math.max(0, y - length * 0.25)
      );

      ctx.strokeStyle =
        Math.random() > 0.5
          ? "rgba(255,255,255,0.19)"
          : "rgba(30,15,30,0.10)";

      ctx.lineWidth = Math.random() * 1.2 + 0.2;
      ctx.stroke();
    }

    // Subtle foil sheen.
    const sheen = ctx.createLinearGradient(
      0, 0, width * 0.8, height
    );
    sheen.addColorStop(0, "rgba(255,255,255,0.2)");
    sheen.addColorStop(0.5, "rgba(255,255,255,0)");
    sheen.addColorStop(1, "rgba(255,47,159,0.08)");

    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, width, height);

    // Return to normal compositing after drawing.
    ctx.globalCompositeOperation = "source-over";
  }, []);

  useEffect(() => {
    drawFoil();

    const observer = new ResizeObserver(() => {
      if (!isScratching.current && !revealedRef.current) {
        drawFoil();
      }
    });

    if (cardRef.current) observer.observe(cardRef.current);

    return () => {
      observer.disconnect();
      if (checkFrame.current) {
        cancelAnimationFrame(checkFrame.current);
      }
    };
  }, [drawFoil]);

  const finishReveal = useCallback(() => {
    if (revealedRef.current) return;

    revealedRef.current = true;
    isScratching.current = false;
    lastPoint.current = null;

    setIsScratchingUI(false);
    setProgress(100);
    setRevealed(true);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Pink celebration!
    const colors = ["#C21891", "#E6A4D0", "#E6B8D9", "#FFFFFF"];

    confetti({
      particleCount: 130,
      spread: 100,
      startVelocity: 36,
      origin: { x: 0.72, y: 0.55 },
      colors,
      ticks: 220,
      disableForReducedMotion: true,
    });

    setTimeout(() => {
      confetti({
        particleCount: 55,
        spread: 130,
        startVelocity: 23,
        origin: { x: 0.72, y: 0.55 },
        colors,
        disableForReducedMotion: true,
      });
    }, 350);
  }, []);

  // Estimate how much of the foil has been erased.
  const checkProgress = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || revealedRef.current) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    try {
      // Sample a grid rather than checking every pixel.
      const step = 12;
      const pixels = ctx.getImageData(0, 0, width, height).data;

      let total = 0;
      let cleared = 0;

      for (let y = step / 2; y < height; y += step) {
        for (let x = step / 2; x < width; x += step) {
          const alpha = pixels[(Math.floor(y) * width + Math.floor(x)) * 4 + 3];
          total++;

          if (alpha < 80) cleared++;
        }
      }

      const percent = total
        ? Math.min(100, Math.round((cleared / total) * 100))
        : 0;

      setProgress(percent);

      if (percent >= SCRATCH_THRESHOLD) {
        finishReveal();
      }
    } catch (error) {
      console.error("Unable to measure scratch progress:", error);
    }
  }, [finishReveal]);

  const getPoint = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const scratchAt = (point) => {
    const canvas = canvasRef.current;
    if (!canvas || revealedRef.current) return;

    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const dpr = canvas.width / rect.width;

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 48;

    ctx.beginPath();

    if (lastPoint.current) {
      ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
      ctx.lineTo(point.x, point.y);
    } else {
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(point.x + 0.1, point.y + 0.1);
    }

    ctx.stroke();

    // A wider, soft eraser creates a satisfying brushed edge.
    ctx.globalAlpha = 0.22;
    ctx.lineWidth = 66;
    ctx.stroke();

    ctx.restore();

    lastPoint.current = point;

    if (!checkFrame.current) {
      checkFrame.current = requestAnimationFrame(() => {
        checkFrame.current = null;
        checkProgress();
      });
    }
  };

  const handlePointerDown = (event) => {
    if (revealedRef.current) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    isScratching.current = true;
    lastPoint.current = null;
    setIsScratchingUI(true);

    scratchAt(getPoint(event));
  };

  const handlePointerMove = (event) => {
    if (!isScratching.current || revealedRef.current) return;
    event.preventDefault();
    scratchAt(getPoint(event));
  };

  const stopScratching = () => {
    isScratching.current = false;
    lastPoint.current = null;
    setIsScratchingUI(false);
  };

  return (
    <section className="scratch-page">
      <Background
        density={1.2}
        colors={["#ffffff", "#ff4db8", "#e6007e"]}
        className="opacity-60"
      />

      <main className="scratch-layout">
        <div className="scratch-intro">
          <h1 className="font-heading">
            Reveal theme
          </h1>
        </div>

        <div
          className={`scratch-card ${
            revealed ? "scratch-card-revealed" : ""
          } ${isScratchingUI ? "is-scratching" : ""}`}
          ref={cardRef}
        >
          {/* The artwork underneath the foil */}
          <div className="scratch-artwork">
            <div className="scratch-art-glow" />
            <div className="scratch-moon" />
            <div className="scratch-mountains" />
            <div className="scratch-water" />
            <div className="scratch-stars">✦　·　✧　·　✦</div>

            
        <div className="scratch-theme-copy">
          <span className="art-label">
            THE GRAND REVEAL
          </span>

          <div className="font-subheading text-2xl md:text-4xl py-4 mt-4">
            EMPOWERING SOCIETY
            <br />
            THROUGH INTELLIGENT
            <br />
            INNOVATION
          </div>

          <span className="art-rule" />

          <p className="art-date font-paragraph">
            28 NOVEMBER
          </p>

          <p className="art-date font-paragraph">
            8:00 AM – 8:00 PM
          </p>

          <p className="art-venue font-paragraph">
            SIDDAGANGA INSTITUTE OF TECHNOLOGY, TUMKUR
          </p>

          
        </div>

          </div>

          {/* Canvas foil: drag to erase */}
          <canvas
            ref={canvasRef}
            className={`scratch-foil ${
              revealed ? "foil-cleared" : ""
            }`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopScratching}
            onPointerCancel={stopScratching}
            onLostPointerCapture={stopScratching}
            aria-label="Scratch this silver surface to reveal the event theme"
          />

          {!revealed && (
            <div className="foil-hint" aria-hidden="true">
              <span>✧</span>
              SCRATCH HERE
            </div>
          )}

          <div className="scratch-card-corner corner-top" />
          <div className="scratch-card-corner corner-bottom" />
        </div>
      </main>

      
    </section>
  );
}
