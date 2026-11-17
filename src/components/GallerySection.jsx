import { useState, useEffect, useRef, useMemo } from "react";
// import galleryPhoto from "../assets/images/gallery-photo.jpg";
import galleryPhoto1 from '../assets/images/gallery/IMG1.JPG'
import galleryPhoto2 from '../assets/images/gallery/IMG2.JPG'
import galleryPhoto3 from '../assets/images/gallery/IMG3.JPG'
import galleryPhoto4 from '../assets/images/gallery/IMG4.JPG'
import galleryPhoto5 from '../assets/images/gallery/IMG5.JPG'


import Background from "../utils/Background";

/* ── Brand Palette Tokens ─────────────────────────────────────────── */
const BLACK = "#000";
const MAG = "#c21891";
const WHITE = "#fff";
const RED = "#ff4d4d";

// Photo positions — Desktop: balanced wide pentagon constellation
const DESKTOP_PHOTOS = [
  { src: galleryPhoto1, x: -520, y: -150, r: -2 },   // 0: Upper-Left
  { src: galleryPhoto2, x: 0, y: -270, r: 0 },       // 1: Top-Center
  { src: galleryPhoto3, x: 520, y: -150, r: 2 },     // 2: Upper-Right
  { src: galleryPhoto4, x: 320, y: 260, r: -1 },     // 3: Lower-Right
  { src: galleryPhoto5, x: -320, y: 260, r: 1 },     // 4: Lower-Left
];

// Photo positions — Mobile: portrait-proportioned pentagon (spread kept to avoid overlap)
const MOBILE_PHOTOS = [
  { src: galleryPhoto1, x: -240, y: -80, r: -2 },   // 0: Upper-Left
  { src: galleryPhoto2, x: 0, y: -290, r: 0 },       // 1: Top-Center
  { src: galleryPhoto3, x: 240, y: -80, r: 2 },      // 2: Upper-Right
  { src: galleryPhoto4, x: 150, y: 220, r: -1 },     // 3: Lower-Right
  { src: galleryPhoto5, x: -150, y: 220, r: 1 },     // 4: Lower-Left
];

// Complete 5-point star constellation lines (perimeter + all inner chords)
const LINKS = [
  // Outer perimeter pentagon
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 0],
  // Inner star chords
  [0, 2], [1, 3], [2, 4], [0, 3], [1, 4],
];

const CW = 230, CH = 290; // card base size on the map
const CUT = "polygon(0 6%, 8% 0, 100% 0, 100% 94%, 92% 100%, 0 100%)";

export default function ConstellationGallery() {
  const trackRef = useRef(null);
  const rootRef = useRef(null);
  const [focus, setFocus] = useState(null); // Starts at map
  const [vp, setVp] = useState({
    w: typeof window !== "undefined" ? window.innerWidth : 390,
    h: typeof window !== "undefined" ? window.innerHeight : 800,
  });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const sx = useRef(0);
  const dragDx = useRef(0);

  const isMobile = vp.w < 640;
  const photos = isMobile ? MOBILE_PHOTOS : DESKTOP_PHOTOS;
  const n = photos.length;

  useEffect(() => {
    const fit = () => {
      if (rootRef.current) {
        const rect = rootRef.current.getBoundingClientRect();
        setVp({
          w: rect.width || window.innerWidth,
          h: rect.height || window.innerHeight || 800,
        });
      } else {
        setVp({
          w: window.innerWidth,
          h: window.innerHeight || 800,
        });
      }
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const [isInView, setIsInView] = useState(false);

  // Detect when the gallery section is in the viewport — always start at map when scrolling in!
  useEffect(() => {
    if (!trackRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          setFocus(null); // First when scrolled, show the map!
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, []);

  // Continuous automated cycle:
  // After showing map first, every 2 seconds advances continuously:
  // Map (null) -> Photo 0 -> Photo 1 -> Photo 2 -> Photo 3 -> Photo 4 -> Map (null) -> Photo 0 ...
  useEffect(() => {
    if (!isInView) return;
    const timer = setInterval(() => {
      setFocus((f) => {
        if (f === null) return 0; // From map, zoom to photo 0
        if (f >= n - 1) return null; // After photo 4, return to full map
        return f + 1; // 0 -> 1 -> 2 -> 3 -> 4
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [isInView, n]);

  const go = (d) => {
    setFocus((f) => {
      if (f === null) {
        return d > 0 ? 0 : n - 1;
      }
      const next = f + d;
      if (next >= n || next < 0) {
        return null; // Return to map
      }
      return next;
    });
  };

  useEffect(() => {
    const onKey = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target?.tagName) || e.target?.isContentEditable) {
        return;
      }
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Escape") setFocus(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focus, n]);

  const bounds = useMemo(() => {
    const xs = photos.map((p) => p.x), ys = photos.map((p) => p.y);
    return {
      minX: Math.min(...xs) - CW / 2, maxX: Math.max(...xs) + CW / 2,
      minY: Math.min(...ys) - CH / 2, maxY: Math.max(...ys) + CH / 2,
    };
  }, [photos]);

  // camera: which map point sits at which screen point, and how zoomed in
  const cam = useMemo(() => {
    const headerSpace = isMobile ? 110 : 125;
    const bottomSpace = isMobile ? 24 : 40;
    const availH = Math.max(vp.h - headerSpace - bottomSpace, 240);
    const availW = vp.w * (isMobile ? 0.94 : 0.86);
    const sy = headerSpace + availH / 2;

    if (focus === null) {
      const padX = isMobile ? 16 : 60;
      const padY = isMobile ? 16 : 60;
      const bw = bounds.maxX - bounds.minX + padX;
      const bh = bounds.maxY - bounds.minY + padY;
      // Generously fill the viewport with balanced margins
      const s = Math.min(availW / bw, (availH * 0.95) / bh);
      return {
        x: (bounds.minX + bounds.maxX) / 2,
        y: (bounds.minY + bounds.maxY) / 2,
        s,
        sy,
      };
    }
    const p = photos[focus];
    const maxCardW = isMobile ? Math.min(vp.w * 0.65, 240) : Math.min(vp.w * 0.60, 480);
    const maxCardH = isMobile ? Math.min(availH * 0.58, 300) : Math.min(vp.h * 0.52, 440);
    return {
      x: p.x,
      y: p.y,
      s: Math.min(maxCardW / CW, maxCardH / CH),
      sy,
    };
}, [focus, vp, bounds, isMobile, photos]);

const ease = "transform 0.7s cubic-bezier(.22,1,.36,1)";

return (
  <section
    id="gallery"
    ref={trackRef}
    className="c-gallery-track"
  >
    <style>{STATIC_CSS}</style>

    <div
      ref={rootRef}
      className={`c-root ${focus === null ? "overview" : "focused"}`}
      onPointerMove={(e) => {
        if (focus !== null || e.pointerType !== "mouse" || !rootRef.current) return;
        const rect = rootRef.current.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / (rect.width || vp.w) - 0.5;
        const relY = (e.clientY - rect.top) / (rect.height || vp.h) - 0.5;
        setTilt({ x: relX * -28, y: relY * -28 });
      }}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
    >
      {/* Background from Background.jsx */}
      <Background
        density={0.9}
        colors={["#ffffff", "#FF4DB8", "#E6007E"]}
        speed={1}
      />

      {/* Section Header */}
      <header className="c-header-container">
        <h2 className="c-title font-heading">GALLERY</h2>
        <div className="c-title-line" />
      </header>

      {/* Swipe area + interactive star map */}
      <div
        className="c-stage"
        style={{ touchAction: "pan-y" }}
        onPointerDown={(e) => {
          sx.current = e.clientX;
          dragDx.current = 0;
        }}
        onPointerMove={(e) => {
          if (sx.current !== 0) {
            dragDx.current = e.clientX - sx.current;
          }
        }}
        onPointerUp={(e) => {
          const diff = e.clientX - sx.current;
          if (Math.abs(diff) > 40) {
            go(diff < 0 ? 1 : -1);
          } else if (
            focus !== null &&
            Math.abs(diff) <= 10 &&
            (e.target === e.currentTarget ||
              e.target.classList.contains("c-tilt") ||
              e.target.tagName === "svg" ||
              e.target.tagName === "line")
          ) {
            setFocus(null);
          }
          sx.current = 0;
          dragDx.current = 0;
        }}
        onPointerCancel={() => {
          sx.current = 0;
          dragDx.current = 0;
        }}
      >
        <div className="c-tilt" style={{ transform: `translate(${tilt.x}px, ${tilt.y}px)` }}>
          <div
            className="c-world"
            style={{
              transform: `translate(${vp.w / 2}px, ${cam.sy}px) scale(${cam.s}) translate(${-cam.x}px, ${-cam.y}px)`,
              transition: ease,
            }}
          >


            {photos.map((ph, i) => {
              const on = focus === i;
              return (
                <button
                  key={i}
                  type="button"
                  className={`c-node ${on ? "on" : ""}`}
                  aria-label={`Photo ${i + 1}`}
                  onClick={() => {
                    if (Math.abs(dragDx.current) < 15) {
                      setFocus(on ? null : i);
                    }
                  }}
                  style={{
                    left: ph.x - CW / 2, top: ph.y - CH / 2, width: CW, height: CH,
                    transform: `rotate(${on ? 0 : ph.r}deg) scale(${on ? 1.06 : 1})`,
                    opacity: focus === null || on ? 1 : 0.22,
                  }}
                >
                  <span className="c-frame">
                    <img src={ph.src} alt={`Photo ${i + 1}`} draggable={false} loading="lazy" />
                    <span className="c-cyber-corner tl" />
                    <span className="c-cyber-corner br" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>


    </div>
  </section>
);
}

const STATIC_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Michroma&family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

/* ── Gallery Section ── */
.c-gallery-track {
  position: relative;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  background-color: #000;
  overflow: hidden;
}

@media (max-width: 640px) {
  .c-gallery-track {
    height: 100vh;
    height: 100dvh;
  }
}

/* ── Viewport Container ── */
.c-root {
  --black: #000;
  --mag: #c21891;
  --white: #fff;
  --red: #ff4d4d;
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background-color: var(--black);
  color: var(--white);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  user-select: none;
  -webkit-user-select: none;
}


/* ── Deep Space Stars ── */
.c-stars {
  position: absolute;
  inset: -10%;
  pointer-events: none;
  z-index: 1;
}
.c-stars span {
  position: absolute;
  border-radius: 50%;
  background: ${WHITE};
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
}

/* ── Header & Title (Exact Rules & Regulations Style) ── */
.c-header-container {
  position: absolute;
  z-index: 10;
  left: 0;
  right: 0;
  top: clamp(40px, 6vh, 65px);
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
}

.c-title {
  margin: 0;
  text-align: center;
  font-family: font-heading;
  font-weight: 900;
  letter-spacing: 0.08em;
  color: ${WHITE};
  font-size: clamp(30px, 5.5vw, 48px);
  text-transform: uppercase;
}

.c-title-line {
  margin-top: 14px;
  height: 1px;
  width: 96px;
  background-color: ${MAG};
  box-shadow: 0 0 10px ${MAG};
}


/* ── Interactive Stage ── */
.c-stage {
  position: absolute;
  inset: 0;
  z-index: 2;
}

.c-tilt {
  position: absolute;
  inset: 0;
  transition: transform .5s ease-out;
}

.c-world {
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: 0 0;
  will-change: transform;
}

.c-lines {
  position: absolute;
  left: 0;
  top: 0;
  overflow: visible;
  pointer-events: none;
}

/* ── Photo Cards ── */
.c-node {
  position: absolute;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  filter: drop-shadow(0 6px 18px rgba(0, 0, 0, 0.85));
  transition: transform 0.7s cubic-bezier(.22,1,.36,1), opacity .7s, filter .35s;
}

.c-node:not(.on):hover {
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 6px rgba(255, 255, 255, 0.4));
}

.c-node.on {
  cursor: default;
  filter: drop-shadow(0 14px 36px rgba(0, 0, 0, 0.95));
}

.c-node:focus-visible {
  outline: 2px solid ${WHITE};
  outline-offset: 6px;
}

.c-node::before {
  content: "";
  position: absolute;
  inset: -15px;
  z-index: 1;
}

.c-frame {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  padding: 3px;
  box-sizing: border-box;
  background: linear-gradient(135deg, ${RED} 0%, ${MAG} 55%, #660048 100%);
  clip-path: ${CUT};
  transition: all 0.3s ease;
}

.c-frame img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 35%;
  background: ${BLACK};
  clip-path: ${CUT};
  pointer-events: none;
  transition: transform 0.7s cubic-bezier(.22,1,.36,1);
}

.c-node.on .c-frame img {
  transform: scale(1.1);
}

/* Cyber Accent Corners */
.c-cyber-corner {
  position: absolute;
  width: 8px;
  height: 8px;
  pointer-events: none;
  z-index: 2;
}
.c-cyber-corner.tl {
  top: 3px;
  left: 3px;
  border-top: 2px solid #FFFFFF;
  border-left: 2px solid #FFFFFF;
}
.c-cyber-corner.br {
  bottom: 3px;
  right: 3px;
  border-bottom: 2px solid #FFFFFF;
  border-right: 2px solid #FFFFFF;
}

/* ── HUD / Control Panel ── */
.c-hud {
  position: absolute;
  z-index: 10;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0 16px max(24px, env(safe-area-inset-bottom));
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.c-info {
  text-align: center;
  max-width: 480px;
  width: 100%;
  pointer-events: auto;
  animation: c-in .65s .3s both cubic-bezier(0.16, 1, 0.3, 1);
  background: rgba(12, 10, 18, 0.82);
  border: 1px solid rgba(194, 24, 145, 0.4);
  border-radius: 20px;
  padding: 16px 24px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 14px 44px rgba(0, 0, 0, 0.8), 0 0 28px rgba(194, 24, 145, 0.22);
}

.c-info.overview-hud {
  max-width: fit-content;
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
}

.c-count-wrapper {
  margin-bottom: 8px;
}

.c-count {
  display: inline-block;
  padding: 3px 14px;
  border-radius: 9999px;
  background: rgba(230, 0, 126, 0.14);
  border: 1px solid rgba(230, 0, 126, 0.5);
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: #ff9fd6;
  text-shadow: 0 0 8px rgba(255, 77, 184, 0.5);
  box-shadow: 0 0 12px rgba(230, 0, 126, 0.2);
}

.c-info h2 {
  margin: 0 0 6px;
  font-family: 'Michroma', sans-serif;
  font-weight: 400;
  font-size: clamp(16px, 3.8vw, 21px);
  color: #FFFFFF;
  letter-spacing: 0.05em;
  text-shadow: 0 0 16px rgba(255, 255, 255, 0.4);
}

.c-info p {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.82);
}

/* ── Modern Sleek Buttons ── */
.c-btns {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  pointer-events: auto;
}

/* Circular Prev / Next Buttons */
.c-btn-icon {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: rgba(22, 16, 30, 0.85);
  color: ${WHITE};
  border: 1.5px solid rgba(194, 24, 145, 0.6);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5), 0 0 12px rgba(194, 24, 145, 0.25);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: auto;
}

.c-btn-icon:hover {
  background: linear-gradient(135deg, ${MAG}, ${RED});
  border-color: ${WHITE};
  color: ${WHITE};
  box-shadow: 0 0 20px rgba(194, 24, 145, 0.8), 0 0 10px rgba(255, 77, 77, 0.6);
  transform: scale(1.08);
}

.c-btn-icon:active {
  transform: scale(0.94);
}

.c-btn-icon:focus-visible {
  outline: 2px solid ${WHITE};
  outline-offset: 3px;
}

/* Full Map Action Pill */
.c-btn-pill {
  height: 42px;
  padding: 0 20px;
  border-radius: 9999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, rgba(230, 0, 126, 0.25) 0%, rgba(194, 24, 145, 0.15) 100%);
  color: ${WHITE};
  border: 1.5px solid rgba(230, 0, 126, 0.65);
  box-shadow: 0 0 16px rgba(230, 0, 126, 0.28);
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.c-btn-pill:hover {
  background: linear-gradient(135deg, ${RED} 0%, ${MAG} 100%);
  border-color: #FFFFFF;
  box-shadow: 0 0 26px rgba(230, 0, 126, 0.7);
  transform: translateY(-2px) scale(1.03);
}

.c-btn-pill:active {
  transform: translateY(0) scale(0.96);
}

.c-btn-pill:focus-visible {
  outline: 2px solid ${WHITE};
  outline-offset: 3px;
}

.c-btn-icon-inline {
  color: #ff9fd6;
  transition: transform 0.25s ease;
}

.c-btn-pill:hover .c-btn-icon-inline {
  color: #FFFFFF;
  transform: rotate(90deg);
}

/* Explore Tour Button (Overview mode) */
.c-btn-tour {
  height: 48px;
  padding: 0 26px;
  border-radius: 9999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, rgba(230, 0, 126, 0.85) 0%, rgba(194, 24, 145, 0.95) 100%);
  color: ${WHITE};
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 28px rgba(230, 0, 126, 0.65), 0 6px 20px rgba(0, 0, 0, 0.6);
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.c-btn-tour:hover {
  background: linear-gradient(135deg, ${MAG} 0%, ${RED} 100%);
  border-color: #FFFFFF;
  box-shadow: 0 0 38px rgba(230, 0, 126, 0.9), 0 8px 24px rgba(0, 0, 0, 0.7);
  transform: translateY(-3px) scale(1.05);
}

.c-btn-tour:active {
  transform: translateY(0) scale(0.97);
}

.c-spin-hover {
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.c-btn-tour:hover .c-spin-hover {
  transform: rotate(180deg);
}

/* ── Pagination Dots Indicator ── */
.c-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
}

.c-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  padding: 0;
  border: none;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.c-dot:hover {
  background: #ff9fd6;
  transform: scale(1.3);
}

.c-dot.active {
  width: 22px;
  border-radius: 9999px;
  background: linear-gradient(90deg, ${MAG}, ${RED});
  box-shadow: 0 0 10px rgba(194, 24, 145, 0.8);
}

/* ── Mobile Optimizations ── */
@media (max-width: 640px) {
  .c-gallery-track {
    height: 100vh;
    height: 100dvh;
  }
  .c-root {
    min-height: 0;
    height: 100%;
  }
  .c-root.overview .c-header-container,
  .c-root.focused .c-header-container {
    top: 76px;
  }
  .c-title {
    font-size: clamp(22px, 6.5vw, 32px);
  }
  .c-title-line {
    margin-top: 10px;
    width: 80px;
  }
  .c-hud {
    padding-bottom: max(18px, env(safe-area-inset-bottom));
  }
  .c-btns {
    margin-top: 0;
    gap: 16px;
  }
  .c-btn-icon {
    width: 42px;
    height: 42px;
  }
  .c-btn-pill {
    height: 38px;
    padding: 0 16px;
    font-size: 13px;
  }
  .c-btn-tour {
    height: 44px;
    padding: 0 20px;
    font-size: 13.5px;
  }
  .c-dots {
    margin-top: 8px;
    gap: 5px;
  }
}

@keyframes c-in {
  from { opacity: 0; transform: translateY(12px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes c-pulse {
  0%, 100% { opacity: 0.6; transform: scale(0.9); }
  50%      { opacity: 1; transform: scale(1.15); }
}

@media (prefers-reduced-motion: reduce) {
  .c-world, .c-stars, .c-node, .c-title, .c-tilt, .c-header-container {
    transition-duration: .01s !important;
  }
  .c-info { animation: none; }
  .c-badge-icon { animation: none; }
}
`;
