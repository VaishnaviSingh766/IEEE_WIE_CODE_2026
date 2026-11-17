import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../utils/Button"; // <-- adjust the path if your Button lives elsewhere

import openInnovationLogo from "../assets/images/domains/open_innovation.png";
import healthcareLogo from "../assets/images/domains/healthcare.png";
import smartEducationLogo from "../assets/images/domains/smartedu.png";
import environmentLogo from "../assets/images/domains/environment.png";
import womenEmpowermentLogo from "../assets/images/domains/women.png";
import smartCityLogo from "../assets/images/domains/smartcity.png";
import agricultureLogo from "../assets/images/domains/agriculture.png";
import socialCommunityLogo from "../assets/images/domains/social.png";

const DOMAIN_LOGOS = {
  open: openInnovationLogo,
  health: healthcareLogo,
  education: smartEducationLogo,
  environment: environmentLogo,
  women: womenEmpowermentLogo,
  city: smartCityLogo,
  agri: agricultureLogo,
  social: socialCommunityLogo,
};

const DOMAIN_TAGLINES = {
  open: "Imagine beyond boundaries",
  health: "Smarter care for every life",
  education: "Learn without limits",
  environment: "Innovate for a greener tomorrow",
  women: "Empower. Enable. Elevate.",
  city: "Build the cities of tomorrow",
  agri: "Grow a smarter food future",
  social: "Technology with human impact",
};

/* ------------------------------------------------------------------
   DOMAIN CARD — "holo cartridge"
   - asymmetric silhouette (top-left + bottom-right cuts)
   - hexagon logo breaking out of the top edge
   - MAGNET hover: the card is gently pulled toward the cursor and the
     logo is pulled a bit further (parallax), then eases back on leave
   - uses the shared <Button /> component

   Tailwind note: arbitrary values must stay on ONE line, so the
   complex gradients live in `style`.
------------------------------------------------------------------- */

const CUT = 36;
const HEX = "polygon(50% 0, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)";
const shape = (c) =>
  `polygon(${c}px 0, 100% 0, 100% calc(100% - ${c}px), calc(100% - ${c}px) 100%, 0 100%, 0 ${c}px)`;

/* how far (px) things are pulled toward the cursor */
const CARD_PULL = 9;
const LOGO_PULL = 16;

export default function DomainCard({ id, title, onSelect, index = 0 }) {
  const logo = DOMAIN_LOGOS[id];
  const navigate = useNavigate();
  const rootRef = useRef(null);

  /* ---------- magnet ---------- */
  const handleMove = (e) => {
    if (e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = rootRef.current;
    if (!el) return;

    // measured on the stationary wrapper, so the pull never feeds back on itself
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);

    el.style.setProperty("--tx", `${(dx * CARD_PULL).toFixed(2)}px`);
    el.style.setProperty("--ty", `${(dy * CARD_PULL).toFixed(2)}px`);
    el.style.setProperty("--lx", `${(dx * LOGO_PULL).toFixed(2)}px`);
    el.style.setProperty("--ly", `${(dy * LOGO_PULL).toFixed(2)}px`);
  };

  const handleLeave = () => {
    const el = rootRef.current;
    if (!el) return;
    ["--tx", "--ty", "--lx", "--ly"].forEach((v) => el.style.setProperty(v, "0px"));
  };

  /* ---------- explore (same behaviour the <Link> had) ---------- */
  const handleExplore = (e) => {
    onSelect?.(id, e);
    if (e?.defaultPrevented) return;
    navigate(`/domains/${id}`);
  };

  return (
    <div
      ref={rootRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ animationDelay: `${index * 90}ms` }}
      className="group relative isolate mx-auto h-full w-full max-w-[280px] cursor-default pt-16 animate-[domainBoot_1.1s_cubic-bezier(0.22,1,0.36,1)_backwards] sm:max-w-[300px] lg:max-w-[310px] motion-reduce:animate-none"
    >
      {/* ============ MAGNET LAYER ============ */}
      <div className="relative h-full min-h-[300px] w-full transition-transform duration-300 ease-out [transform:translate3d(var(--tx,0px),var(--ty,0px),0)] group-hover:duration-150 sm:min-h-[320px] lg:min-h-[340px] motion-reduce:transform-none">
        {/* ---- border ---- */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            clipPath: shape(CUT),
            background:
              "linear-gradient(160deg, #FF5BCB 0%, rgba(194,24,145,0.35) 40%, rgba(194,24,145,0.35) 60%, #FF5BCB 100%)",
          }}
        />
        {/* brighter border that fades in on hover */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            clipPath: shape(CUT),
            background:
              "linear-gradient(160deg, #FFB8E8 0%, #C21891 45%, #C21891 55%, #FFB8E8 100%)",
          }}
        />

        {/* ---- body ---- */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[1.5px] overflow-hidden bg-[#09030a]"
          style={{ clipPath: shape(CUT - 0.6) }}
        >
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,91,203,0.045) 0 1px, transparent 1px 4px)",
            }}
          />
          <div
            className="absolute inset-x-0 top-0 h-40"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(255,91,203,0.28), transparent 70%)",
            }}
          />
        </div>

        {/* ---- corner ticks ---- */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-2 top-2 h-5 w-5 border-r-2 border-t-2 border-[#FF5BCB] transition-all duration-500 group-hover:h-7 group-hover:w-7"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2 left-2 h-5 w-5 border-b-2 border-l-2 border-[#FF5BCB] transition-all duration-500 group-hover:h-7 group-hover:w-7"
        />

        {/* ---- LOGO: hexagon that breaks out of the card ---- */}
        <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2">
          {/* extra magnet pull so the logo travels further than the card */}
          <div className="transition-transform duration-300 ease-out [transform:translate3d(var(--lx,0px),var(--ly,0px),0)] motion-reduce:transform-none">
            <div className="relative h-32 w-32 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 sm:h-36 sm:w-36 motion-reduce:transition-none">
              {/* projected shadow */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-[calc(100%+4px)] h-3 w-24 -translate-x-1/2 rounded-full bg-[#FF5BCB]/45 blur-md"
              />
              <div className="relative h-full w-full animate-[domainFloat_6s_ease-in-out_infinite] drop-shadow-[0_0_16px_rgba(255,91,203,0.55)] motion-reduce:animate-none">
                <div
                  className="absolute inset-0 bg-gradient-to-b from-[#FFB8E8] via-[#C21891] to-[#FF5BCB]"
                  style={{ clipPath: HEX }}
                />
                <div
                  className="absolute inset-[3px] flex items-center justify-center overflow-hidden bg-[#0a0309]"
                  style={{ clipPath: HEX }}
                >
                  {logo ? (
                    <img
                      src={logo}
                      alt={`${title} logo`}
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                      className="h-full w-full select-none object-contain p-6"
                    />
                  ) : (
                    <div
                      role="img"
                      aria-label={`${title} logo`}
                      className="h-12 w-12 rotate-45 border-2 border-[#FF5BCB]/70"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---- CONTENT (title + button sit higher: bigger bottom padding) ---- */}
        <div className="relative z-10 flex h-full min-h-[inherit] flex-col items-center px-8 pb-14 pt-28 text-center">
          <div className="flex flex-1 -translate-y-4 flex-col items-center justify-center">
           <h3 className="font-subheading w-full text-center text-[1.1rem] uppercase leading-snug tracking-wider text-white sm:text-[1.15rem] lg:text-[1.2rem]">
  {title}
</h3>
            <span
              aria-hidden="true"
              className="mt-3 h-[2px] w-16 bg-[#FF5BCB] shadow-[0_0_10px_#FF5BCB] transition-all duration-500 group-hover:w-20"
            />
            <p className="font-paragraph mt-8 max-w-[210px] !text-sm leading-relaxed tracking-[0.05em] text-white">
              {DOMAIN_TAGLINES[id]}
            </p>
          </div>

          <Button className="font-subheading" onClick={handleExplore} aria-label={`Explore ${title}`}>
            Explore
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes domainBoot {
          0%   { opacity: 0; clip-path: inset(49.5% -120px 49.5% -120px); filter: brightness(3); }
          35%  { opacity: 1; clip-path: inset(49.5% -120px 49.5% -120px); filter: brightness(2); }
          70%  { clip-path: inset(-120px); filter: brightness(1.6); }
          80%  { filter: brightness(0.8); }
          100% { clip-path: inset(-120px); filter: brightness(1); }
        }
        @keyframes domainFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-7px); }
        }
      `}</style>
    </div>
  );
}