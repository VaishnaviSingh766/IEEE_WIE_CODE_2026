import { useEffect, useRef, useState, forwardRef } from "react";
import Background from "../utils/Background";

/* ── Brand tokens ─────────────────────────────────────────────── */
const MAG = "#C21891";
const MAG6 = "rgba(194,24,145,0.65)";
const MAG4 = "rgba(194,24,145,0.4)";
const MAG2 = "rgba(194,24,145,0.2)";
const MAG1 = "rgba(194,24,145,0.12)";
const MAGD = "rgba(194,24,145,0.18)";
const BACKGROUND_COLORS = ["#ffffff", "#FF4DB8", "#E6007E"];

/* ── Content ──────────────────────────────────────────────────── */
const EVENTS = [
  {
    number: "01",
    time: "Nov 5th",
    title: "Curtain Raiser WIE Code",
    description: "Join the kickoff and learn what to expect from WIE Code.",
  },
  {
    number: "02",
    time: "Nov 8th",
    title: "Registration Starts",
    description: "Sign up and begin your WIE Code journey.",
  },
  {
    number: "03",
    time: "Nov 24th",
    title: "Last Date for Abstract Submission",
    description: "Submit your project abstract by the deadline.",
  },
  {
    number: "04",
    time: "Nov 28th",
    title: "WIE Code",
    description: "Connect with fellow innovators and showcase your ideas.",
  },
];

const ROW_H = 260; // Row height for desktop
const START_Y = 160; // Space between top of container and first node
const END_Y = 80;  // Space between last node and bottom of container (tight fit to card edge)
const AMP = 34;  // Helix horizontal amplitude

/* ── Helix SVG path & Clean Hollow Conduit ────────────────────── */
const HelixConduit = forwardRef(function HelixConduit({ n }, ref) {
  const cx = 500;
  const totalH = START_Y + (n - 1) * ROW_H + END_Y;

  const nodes = Array.from({ length: n }, (_, i) => ({
    x: cx + (i % 2 === 0 ? -AMP : AMP),
    y: START_Y + i * ROW_H,
  }));

  // S-curve Bezier path passing through all alternating nodes
  let d = `M ${cx} 0 C ${cx} 60, ${nodes[0].x} ${nodes[0].y - 70}, ${nodes[0].x} ${nodes[0].y}`;
  for (let i = 1; i < nodes.length; i++) {
    const a = nodes[i - 1];
    const b = nodes[i];
    const mid = (a.y + b.y) / 2;
    d += ` C ${a.x} ${mid}, ${b.x} ${mid}, ${b.x} ${b.y}`;
  }
  const last = nodes[nodes.length - 1];
  // Path continues smoothly past the 4th card to the end of the conduit
  d += ` C ${last.x} ${last.y + 40}, ${cx} ${totalH - 20}, ${cx} ${totalH}`;

  return (
    <svg
      viewBox={`0 0 1000 ${totalH}`}
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="activeBeamGlow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="85%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor={MAG} />
        </linearGradient>
      </defs>

      {/* ── 1. Hollow Conduit Casing (Smooth double-walled channel) ── */}
      {/* Outer subtle glow */}
      <path
        d={d}
        fill="none"
        stroke={MAG}
        strokeWidth={28}
        strokeOpacity={0.08}
        strokeLinecap="round"
      />

      {/* Outer conduit walls */}
      <path
        d={d}
        fill="none"
        stroke="rgba(194,24,145,0.4)"
        strokeWidth={20}
        strokeLinecap="round"
      />

      {/* Hollow interior channel cutout */}
      <path
        d={d}
        fill="none"
        stroke="#000000"
        strokeWidth={14}
        strokeLinecap="round"
      />

      {/* Subtle glass reflection sheen inside the hollow channel */}
      <path
        d={d}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={12}
        strokeLinecap="round"
      />

      {/* ── 2. Idle Central Core Wire ── */}
      <path
        d={d}
        fill="none"
        stroke={MAGD}
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* ── 3. Glowing Active Energy Laser Beam (drawn on scroll) ── */}
      <path
        ref={ref}
        d={d}
        fill="none"
        stroke="url(#activeBeamGlow)"
        strokeWidth={3.5}
        strokeLinecap="round"
        style={{
          filter: `drop-shadow(0 0 6px ${MAG}) drop-shadow(0 0 16px ${MAG6}) drop-shadow(0 0 30px rgba(194,24,145,0.5))`,
        }}
      />
    </svg>
  );
});

/* ── Sleek Rhombus Junction Nodes (NO circles, pure glowing diamond) ── */
function HelixNodes({ n, lit }) {
  const cx = 500;
  const totalH = START_Y + (n - 1) * ROW_H + END_Y;

  const nodes = Array.from({ length: n }, (_, i) => ({
    x: cx + (i % 2 === 0 ? -AMP : AMP),
    y: START_Y + i * ROW_H,
  }));

  return (
    <svg
      viewBox={`0 0 1000 ${totalH}`}
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
      aria-hidden="true"
    >
      {nodes.map(({ x, y }, i) => {
        const on = i < lit;
        return (
          <g key={i} className="transition-all duration-500">
            {/* Soft Ambient Glow BEHIND the rhombus */}
            {on && (
              <rect
                x={x - 14}
                y={y - 14}
                width={28}
                height={28}
                rx={3}
                transform={`rotate(45 ${x} ${y})`}
                fill={MAG}
                opacity={0.65}
                style={{ filter: `blur(8px) drop-shadow(0 0 16px ${MAG})` }}
              />
            )}

            {/* Rhombus Outer Housing */}
            <rect
              x={x - 10}
              y={y - 10}
              width={20}
              height={20}
              rx={2}
              transform={`rotate(45 ${x} ${y})`}
              fill={on ? "#100214" : "#0A0A0E"}
              stroke={on ? "#FFFFFF" : "rgba(194,24,145,0.4)"}
              strokeWidth={2}
              style={on ? { filter: `drop-shadow(0 0 8px #FFFFFF) drop-shadow(0 0 14px ${MAG})` } : undefined}
            />

            {/* Inner Rhombus Core Accent */}
            <rect
              x={x - 5}
              y={y - 5}
              width={10}
              height={10}
              rx={1}
              transform={`rotate(45 ${x} ${y})`}
              fill={on ? "#FFFFFF" : "rgba(194,24,145,0.4)"}
              style={on ? { filter: `drop-shadow(0 0 6px #FFFFFF) drop-shadow(0 0 10px ${MAG})` } : undefined}
            />
          </g>
        );
      })}
    </svg>
  );
}

/* ── Main component ───────────────────────────────────────────── */
export default function Timeline({ events = EVENTS, title = "TIMELINE" }) {
  const [lit, setLit] = useState(0);
  const [progress, setProgress] = useState(0); // 0-1

  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const linePathRef = useRef(null);
  const desktopRefs = useRef([]);
  const mobileRefs = useRef([]);
  const mobileLineRef = useRef(null);

  /* Google Fonts */
  useEffect(() => {
    if (document.getElementById("tl-fonts")) return;
    const l = document.createElement("link");
    l.id = "tl-fonts";
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Michroma&display=swap";
    document.head.appendChild(l);
  }, []);

  const n = events.length;
  const totalH = START_Y + (n - 1) * ROW_H + END_Y;

  /* Scroll driver */
  useEffect(() => {
    let raf = 0;

    const tick = () => {
      raf = 0;
      const section = sectionRef.current;
      const heading = headingRef.current;
      if (!section || !heading) return;

      const vh = window.innerHeight;
      const isDesktop = window.innerWidth >= 640;
      const hRect = heading.getBoundingClientRect();
      const targetRefs = isDesktop ? desktopRefs.current : mobileRefs.current;

      const firstEl = targetRefs[0];
      const lastEl = targetRefs[events.length - 1];

      // Viewport Y position of the 1st rhombus
      let firstRhombusY = 0;
      if (firstEl) {
        const rect = firstEl.getBoundingClientRect();
        firstRhombusY = isDesktop ? (rect.top + rect.height / 2) : (rect.top + 24);
      } else {
        firstRhombusY = hRect.bottom + (isDesktop ? START_Y : 40);
      }

      /* 1. Middle Line Movement:
         Starts as soon as the 1st rhombus appears in the viewport while scrolling,
         and completes 100% when the 4th card reaches the middle of the screen (vh * 0.55) */
      const isFirstRhombusVisible = firstRhombusY <= (isDesktop ? vh : vh * 0.6);

      let prog = 0;
      if (isDesktop && isFirstRhombusVisible) {
        const scrolledSinceFirstRhombus = vh - firstRhombusY;
        let totalTravel = 650;
        if (lastEl) {
          const lastRect = lastEl.getBoundingClientRect();
          const lastRhombusY = isDesktop ? (lastRect.top + lastRect.height / 2) : (lastRect.top + 24);
          totalTravel = (lastRhombusY - firstRhombusY) + (vh - vh * 0.55);
        }
        prog = Math.min(1, Math.max(0, scrolledSinceFirstRhombus / Math.max(150, totalTravel)));
      } else if (!isDesktop) {
        const mobileContainer = mobileLineRef.current?.parentElement?.parentElement;
        if (mobileContainer) {
          const totalMobileH = mobileContainer.clientHeight || 1;
          const mobileLineTop = mobileContainer.getBoundingClientRect().top;
          prog = Math.min(1, Math.max(0, (vh * 0.8 - mobileLineTop) / totalMobileH));    
        }
      }
      setProgress(prog);

      /* Drive desktop SVG line */
      const lp = linePathRef.current;
      if (lp) {
        try {
          const len = lp.getTotalLength();
          lp.style.strokeDasharray = `${len}`;
          lp.style.strokeDashoffset = `${len * (1 - prog)}`;
        } catch (_) { }
      }

      /* Drive mobile vertical line */
      const ml = mobileLineRef.current;
      if (ml) ml.style.height = `${prog * 100}%`;

      /* 2. Sequential Card Reveal:
         Cards appear ONLY when the middle line arrives and touches the rhombus in front of each card */
      let count = 0;
      if (isDesktop) {
        if (lp) {
          try {
            const len = lp.getTotalLength();
            if (len) {
              const currentDrawn = len * prog;
              const tip = lp.getPointAtLength(currentDrawn);
              for (let i = 0; i < events.length; i++) {
                // Node i center is START_Y + i * ROW_H, rhombus top apex is at -10px
                const targetY = START_Y + i * ROW_H - 10;
                if (tip.y >= targetY) {
                  count = i + 1;
                }
              }
            }
          } catch (_) { }
        }
        if (!lp || count === 0) {
          const fallbackFractions = [0.138, 0.375, 0.612, 0.850];
          for (let i = 0; i < events.length; i++) {
            if (prog >= fallbackFractions[i]) {
              count = i + 1;
            }
          }
        }
      } else {
        const mobileContainer = mobileLineRef.current?.parentElement?.parentElement;
        const totalMobileH = mobileContainer?.clientHeight || 1;
        const currentY = prog * totalMobileH;
        for (let i = 0; i < events.length; i++) {
          const el = mobileRefs.current[i];
          if (el) {
            const targetY = el.offsetTop + 24;
            if (currentY >= targetY) {
              count = i + 1;
            }
          }
        }
      }
      setLit(count);
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [events.length, totalH]);

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="relative w-full bg-black text-white overflow-x-clip px-4 pt-16 pb-6 sm:pb-8 sm:px-6"
      aria-labelledby="tl-title"
    >
      <Background
        density={0.9}
        colors={BACKGROUND_COLORS}
        speed={1}
      />

      {/* ── Heading ── */}
      <div className="relative z-10 text-center mb-16 sm:mb-24">
        <h2
          ref={headingRef}
          id="tl-title"
          className="inline-block font-heading tracking-[0.16em]"
        >
          {title}
        </h2>
      </div>

      {/* ══════════ DESKTOP VIEW ══════════ */}
      <div
        className="hidden sm:block relative z-10 mx-auto max-w-[1020px] w-full"
        style={{ height: totalH }}
      >
        {/* Hollow transparent conduit structure & glowing active line */}
        <HelixConduit n={n} ref={linePathRef} />

        {/* Sleek rhombus junction nodes with glow behind */}
        <HelixNodes n={n} lit={lit} />

        {/* Timeline event cards */}
        {events.map((e, i) => {
          const on = i < lit;
          const isCurrent = on && (i === lit - 1); // Card that is currently arriving/in view
          const isLeft = i % 2 === 0; // Card 01 & 03: Left; Card 02 & 04: Right
          const nodeY = START_Y + i * ROW_H;

          return (
            <div
              key={e.number}
              ref={(el) => (desktopRefs.current[i] = el)}
              className="absolute w-full"
              style={{ top: nodeY, transform: "translateY(-50%)", height: ROW_H }}
            >
              {/* Laser stub connector between middle conduit and card */}
              <div
                className="absolute top-1/2 -translate-y-1/2 h-[2px] transition-all duration-500"
                style={{
                  opacity: on ? 0.95 : 0,
                  width: on ? 48 : 0,
                  background: isLeft
                    ? `linear-gradient(to left, ${MAG}, rgba(194,24,145,0.2))`
                    : `linear-gradient(to right, ${MAG}, rgba(194,24,145,0.2))`,
                  left: isLeft ? "calc(50% - 88px)" : "calc(50% + 40px)",
                  boxShadow: `0 0 8px ${MAG}`,
                }}
              />

              {/* Card: slides in from LEFT (Card 1 & 3) and RIGHT (Card 2 & 4), clean dark glass with animated border beam (NO outer glow) */}
              <article
                className="absolute top-1/2 rounded-2xl backdrop-blur-md cursor-pointer overflow-hidden"
                style={{
                  width: "calc(50% - 90px)",
                  left: isLeft ? 0 : undefined,
                  right: isLeft ? undefined : 0,
                  padding: "22px 26px 24px",
                  background: on
                    ? (isCurrent ? "rgba(20, 16, 22, 0.9)" : "rgba(14, 14, 18, 0.85)")
                    : "rgba(12, 12, 16, 0.4)",
                  boxShadow: on
                    ? "0 10px 30px -10px rgba(0, 0, 0, 0.85), 0 2px 6px rgba(0, 0, 0, 0.6)"
                    : "none",
                  opacity: on ? 1 : 0,
                  transform: `translateY(-50%) translateX(${on ? "0px" : isLeft ? "-150px" : "150px"})`,
                  filter: on ? "blur(0px)" : "blur(6px)",
                  pointerEvents: on ? "auto" : "none",
                  transition: "transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), filter 0.85s ease, background 0.45s ease, box-shadow 0.45s ease",
                }}
              >
                {/* Clean border & animated border beam around the card in core website color */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none rounded-2xl overflow-visible"
                  aria-hidden="true"
                >
                  {/* Subtle static core border */}
                  <rect
                    x="1"
                    y="1"
                    rx="16"
                    ry="16"
                    fill="none"
                    stroke={on ? (isCurrent ? "rgba(194, 24, 145, 0.55)" : "rgba(194, 24, 145, 0.28)") : "rgba(194, 24, 145, 0.12)"}
                    strokeWidth="1.5"
                    style={{ width: "calc(100% - 2px)", height: "calc(100% - 2px)" }}
                    className="transition-colors duration-500"
                  />
                  {/* Simple, unique travelling light beam around the card perimeter */}
                  {on && (
                    <rect
                      x="1"
                      y="1"
                      rx="16"
                      ry="16"
                      fill="none"
                      stroke={MAG}
                      strokeWidth={isCurrent ? "2.5" : "2"}
                      strokeDasharray="20 80"
                      strokeLinecap="round"
                      pathLength="100"
                      style={{
                        width: "calc(100% - 2px)",
                        height: "calc(100% - 2px)",
                        animation: `tlBeamRotate ${isCurrent ? "4.5s" : "6s"} linear infinite`,
                        animationDelay: `${i * -1.2}s`,
                      }}
                    />
                  )}
                </svg>

                <div className="relative z-10 flex items-center justify-between mb-2">
                  <span
                    className="font-numbers"
                    style={{
                      fontSize: 26,
                      color: "#FFFFFF",
                      textShadow: isCurrent ? `0 0 14px ${MAG}` : "none",
                      lineHeight: 1,
                      transition: "color 0.45s ease, text-shadow 0.45s ease",
                    }}
                  >
                    {e.number}
                  </span>
                  <span
                    className="text-xs font-bold tracking-wider uppercase px-2.5 py-1 mb-1 rounded-full border transition-all duration-450"
                    style={{
                      background: isCurrent ? "rgba(194,24,145,0.18)" : "rgba(194,24,145,0.08)",
                      borderColor: isCurrent ? MAG : "rgba(194,24,145,0.3)",
                      color: "#FFFFFF",
                    }}
                  >
                    {e.time}
                  </span>
                </div>

                <h3
                  className="font-subheading relative z-10 uppercase tracking-[0.08em]"
                  style={{
                    fontSize: "clamp(16px,1.7vw,19px)",
                    color: "#FFFFFF",
                    margin: "10px 0 12px",
                    paddingBottom: 12,
                    borderBottom: `1px solid ${isCurrent ? MAG : "rgba(194,24,145,0.25)"}`,
                    textShadow: "none",
                    transition: "color 0.45s ease, border-color 0.45s ease",
                  }}
                >
                  {e.title}
                </h3>

                <p className="font-paragraph relative z-10 m-0 !text-sm text-white/85 sm:!text-base leading-relaxed">
                  {e.description}
                </p>
              </article>
            </div>
          );
        })}
      </div>

      {/* ══════════ MOBILE VIEW ══════════ */}
      <div className="sm:hidden relative z-10 mx-auto max-w-[540px] w-full pt-[88px]">
        {/* Hollow transparent structure surrounding the vertical line */}
        <div
          className="absolute top-0 bottom-0 left-[14px] w-[26px] rounded-full border-x border-white/20 bg-white/[0.02] backdrop-blur-[2px] pointer-events-none shadow-[inset_0_0_10px_rgba(194,24,145,0.15)] flex justify-center overflow-hidden"
          aria-hidden="true"
        >
          {/* Idle center line */}
          <div className="w-[2px] h-full" style={{ background: MAGD }} />
          {/* Glowing active core beam */}
          <div
            ref={mobileLineRef}
            className="absolute top-0 w-[3px] rounded-full"
            style={{
              height: 0,
              background: "#FFFFFF",
              boxShadow: `0 0 8px ${MAG}, 0 0 20px ${MAG6}`,
            }}
          />
        </div>

        {events.map((e, i) => {
          const on = i < lit;
          const isCurrent = on && (i === lit - 1);

          return (
            <div
              key={e.number}
              ref={(el) => (mobileRefs.current[i] = el)}
              className={`relative flex items-start cursor-pointer ${i === events.length - 1 ? "mb-0" : "mb-12"}`}
            >
              {/* Rhombus Junction Node: Centered directly at 27px */}
              <div
                className="absolute left-[27px] top-6 -translate-x-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center z-20 transition-all duration-500"
              >
                {/* Glow behind rhombus */}
                {on && (
                  <div
                    className="absolute w-5 h-5 rotate-45 rounded-sm"
                    style={{
                      background: MAG,
                      filter: `blur(6px) drop-shadow(0 0 10px ${MAG})`,
                      opacity: isCurrent ? 0.9 : 0.7,
                    }}
                  />
                )}
                {/* Rhombus diamond shape */}
                <div
                  className="w-4 h-4 rounded-sm rotate-45 border transition-all duration-500 flex items-center justify-center"
                  style={{
                    background: on ? "#100214" : "#0A0A0E",
                    borderColor: on ? "#FFFFFF" : "rgba(194,24,145,0.4)",
                    boxShadow: isCurrent ? `0 0 12px #FFFFFF, 0 0 16px ${MAG}` : (on ? `0 0 8px #FFFFFF` : "none"),
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-sm rotate-45"
                    style={{
                      background: on ? "#FFFFFF" : MAG,
                      boxShadow: on ? `0 0 6px #FFFFFF, 0 0 8px ${MAG}` : "none",
                    }}
                  />
                </div>
              </div>

              {/* Card: slides in from RIGHT upon scrolling on mobile, clean dark glass with animated border beam (NO outer glow) */}
              <article
                className="ml-14 rounded-2xl backdrop-blur-md relative overflow-hidden"
                style={{
                  width: "calc(100% - 56px)",
                  padding: "18px 20px 20px",
                  background: on
                    ? (isCurrent ? "rgba(20, 16, 22, 0.9)" : "rgba(14, 14, 18, 0.85)")
                    : "rgba(12, 12, 16, 0.4)",
                  boxShadow: on
                    ? "0 8px 24px -6px rgba(0, 0, 0, 0.8)"
                    : "none",
                  opacity: on ? 1 : 0,
                  transform: `translateX(${on ? "0px" : "60px"})`,
                  filter: on ? "blur(0px)" : "blur(4px)",
                  pointerEvents: on ? "auto" : "none",
                  transition: "transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), filter 0.75s ease, background 0.45s ease, box-shadow 0.45s ease",
                }}
              >
                {/* Clean border & animated border beam in core website color */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none rounded-2xl overflow-visible"
                  aria-hidden="true"
                >
                  <rect
                    x="1"
                    y="1"
                    rx="16"
                    ry="16"
                    fill="none"
                    stroke={on ? (isCurrent ? "rgba(194, 24, 145, 0.55)" : "rgba(194, 24, 145, 0.28)") : "rgba(194, 24, 145, 0.12)"}
                    strokeWidth="1.5"
                    style={{ width: "calc(100% - 2px)", height: "calc(100% - 2px)" }}
                  />
                  {on && (
                    <rect
                      x="1"
                      y="1"
                      rx="16"
                      ry="16"
                      fill="none"
                      stroke={MAG}
                      strokeWidth={isCurrent ? "2.5" : "2"}
                      strokeDasharray="20 80"
                      strokeLinecap="round"
                      pathLength="100"
                      style={{
                        width: "calc(100% - 2px)",
                        height: "calc(100% - 2px)",
                        animation: `tlBeamRotate ${isCurrent ? "4.5s" : "6s"} linear infinite`,
                        animationDelay: `${i * -1.2}s`,
                      }}
                    />
                  )}
                </svg>

                <div className="relative z-10 flex items-center justify-between mb-1.5">
                  <span
                    className="font-numbers"
                    style={{
                      fontSize: 22,
                      color: "#FFFFFF",
                      textShadow: isCurrent ? `0 0 10px ${MAG}` : "none",
                      lineHeight: 1,
                    }}
                  >
                    {e.number}
                  </span>
                  <span
                    className="text-[11px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full border transition-all duration-450"
                    style={{
                      background: isCurrent ? "rgba(194, 24, 145, 0.18)" : "rgba(194, 24, 145, 0.08)",
                      borderColor: isCurrent ? MAG : "rgba(194, 24, 145, 0.3)",
                      color: "#FFFFFF",
                    }}
                  >
                    {e.time}
                  </span>
                </div>

                <h3
                  className="font-subheading relative z-10 uppercase tracking-[0.08em]"
                  style={{
                    fontSize: 15,
                    color: "#FFFFFF",
                    margin: "6px 0 10px",
                    paddingBottom: 8,
                    borderBottom: `1px solid ${isCurrent ? MAG : "rgba(194, 24, 145, 0.25)"}`,
                  }}
                >
                  {e.title}
                </h3>

                <p className="font-paragraph relative z-10 m-0 !text-sm text-white/80 leading-relaxed">
                  {e.description}
                </p>
              </article>
            </div>
          );
        })}
      </div>

      {/* Perimeter beam keyframes */}
      <style>{`
        @keyframes tlBeamRotate {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -100;
          }
        }
      `}</style>
    </section>
  );
}
