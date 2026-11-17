import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { createPortal, flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

import { useNavigate, useParams } from "react-router-dom";

import { domains } from "./DomainsSection";
import Background from "../utils/Background";
import Button from "../utils/Button";
/* =========================================================
   CONFIG
   ========================================================= */

const BRAND_NAME = "WIE-CODE";
const BRAND_YEAR = "2K26";
const BRAND_TAG = "";

const BACK_TO = {
  pathname: "/",
  hash: "#domains",
};

const PANEL_EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

export const CLOSE_MS = 1100;
export const OPEN_MS = CLOSE_MS;

export const HOLD_MS = 350;
const OPEN_DELAY = HOLD_MS;

const FADE_MS = 400;

const NAVIGATE_AT = CLOSE_MS + HOLD_MS;

const HOME_WAIT = 0;

const BRAND_CUT_TWEAK_EM = 0;

/* =========================================================
   HELPERS
   ========================================================= */

const REVEAL =
  "transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

const SHOWN = "opacity-100 translate-y-0";

const HIDDEN =
  "opacity-0 translate-y-6 motion-reduce:opacity-100 motion-reduce:translate-y-0";

const stagger = (entered, step) => ({
  transitionDelay: entered ? `${step * 110}ms` : "0ms",
});

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function useEntered(delay) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setEntered(true), delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return entered;
}

function useHideMoveToTop() {
  useIsoLayoutEffect(() => {
    const buttons = Array.from(
      document.querySelectorAll('button[aria-label="Move to top"]')
    );

    const previous = buttons.map((button) => button.style.visibility);

    buttons.forEach((button) => {
      button.style.visibility = "hidden";
    });

    return () => {
      buttons.forEach((button, index) => {
        button.style.visibility = previous[index];
      });
    };
  }, []);
}

/* =========================================================
   SCROLLBAR CONTROL
   ========================================================= */

const ensureDocumentScrollbar = () => {
  if (typeof document === "undefined") return;

  /*
   * Keep ONE browser scrollbar permanently allocated.
   * The document itself remains the scroll container.
   *
   * - overflow-y: scroll      -> track is always drawn
   * - scrollbar-gutter: stable -> width is always reserved, so the
   *                               layout never shifts or blinks
   */
  const root = document.documentElement;

  root.style.overflowY = "scroll";
  root.style.scrollbarGutter = "stable";
  document.body.style.overflowY = "visible";
};

/*
 * Jump instantly, even if global CSS sets `scroll-behavior: smooth`.
 * (behavior: "auto" would defer to that CSS and animate visibly
 * underneath the curtain.)
 */
const withInstantScroll = (fn) => {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const previous = root.style.scrollBehavior;

  root.style.scrollBehavior = "auto";

  fn();

  root.style.scrollBehavior = previous;
};

const jumpToTop = () => {
  withInstantScroll(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  });
};

/* =========================================================
   CURTAIN
   ========================================================= */

const measureCapCentreOffsetEm = () => {
  if (typeof document === "undefined") return 0;

  try {
    const context = document.createElement("canvas").getContext("2d");

    context.font = '400 100px "WieCode"';

    const metrics = context.measureText("E");

    if (
      metrics.fontBoundingBoxAscent == null ||
      metrics.fontBoundingBoxDescent == null
    ) {
      return 0;
    }

    const fontAscent = metrics.fontBoundingBoxAscent / 100;
    const fontDescent = metrics.fontBoundingBoxDescent / 100;
    const capHeight = metrics.actualBoundingBoxAscent / 100;

    return (fontAscent - fontDescent - capHeight) / 2;
  } catch {
    return 0;
  }
};

function useBrandCutShift() {
  const [shift, setShift] = useState(measureCapCentreOffsetEm);

  useEffect(() => {
    let alive = true;

    document.fonts?.ready?.then(() => {
      if (alive) {
        setShift(measureCapCentreOffsetEm());
      }
    });

    return () => {
      alive = false;
    };
  }, []);

  return shift + BRAND_CUT_TWEAK_EM;
}

const CURTAIN_KEYFRAMES = `
@keyframes dc-curtain-part-top {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(0, -100%, 0); }
}

@keyframes dc-curtain-part-bottom {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(0, 100%, 0); }
}

@keyframes dc-curtain-close-top {
  0% { transform: translate3d(0, -100%, 0); }
  100% { transform: translate3d(0, 0, 0); }
}

@keyframes dc-curtain-close-bottom {
  0% { transform: translate3d(0, 100%, 0); }
  100% { transform: translate3d(0, 0, 0); }
}

@keyframes dc-curtain-fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes dc-curtain-fade-out {
  0% { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes dc-curtain-seam-in {
  0% { opacity: 0; transform: scaleX(0); }
  100% { opacity: 1; transform: scaleX(1); }
}

@keyframes dc-curtain-seam-out {
  0% { opacity: 1; transform: scaleX(1); }
  100% { opacity: 0; transform: scaleX(0); }
}
`;

function CurtainView({ phase, subtitle, onDone }) {
  const isClosing = phase === "closing";
  const isRelease = phase === "release";
  const wantCovered = phase !== "release";

  const cutShift = useBrandCutShift();

  const panelStyle = (closeName, partName) =>
    isClosing
      ? {
        animation: `${closeName} ${CLOSE_MS}ms ${PANEL_EASE} 0ms both`,
        willChange: "transform",
      }
      : isRelease
        ? {
          animation: `${partName} ${OPEN_MS}ms ${PANEL_EASE} ${OPEN_DELAY}ms both`,
          willChange: "transform",
        }
        : {
          transform: "translate3d(0, 0, 0)",
        };

  const topPanelStyle = panelStyle(
    "dc-curtain-close-top",
    "dc-curtain-part-top"
  );

  const bottomPanelStyle = panelStyle(
    "dc-curtain-close-bottom",
    "dc-curtain-part-bottom"
  );

  const textStyle = isClosing
    ? {
      animation: `dc-curtain-fade-in ${FADE_MS
        }ms ease-out ${CLOSE_MS - FADE_MS}ms both`,
    }
    : isRelease
      ? {
        animation: `dc-curtain-fade-out ${FADE_MS
          }ms ease-out ${OPEN_DELAY}ms both`,
      }
      : { opacity: 1 };

  const seamStyle = isClosing
    ? {
      animation: `dc-curtain-seam-in ${FADE_MS
        }ms ease-out ${CLOSE_MS - FADE_MS}ms both`,
    }
    : isRelease
      ? {
        animation: `dc-curtain-seam-out ${FADE_MS
          }ms ease-out ${OPEN_DELAY}ms both`,
      }
      : { opacity: 1 };

  const handleAnimationEnd = (event) => {
    if (
      isRelease &&
      event.target === event.currentTarget &&
      event.animationName.includes("part")
    ) {
      onDone?.();
    }
  };

  /*
   * Both halves use the SAME offset so the word is split exactly
   * on the seam. (The top half previously had an extra
   * translateY(50%), which pushed its text down and clipped it.)
   */
  const brandShift = { transform: `translateY(${-cutShift}em)` };

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[999] motion-reduce:hidden ${wantCovered ? "pointer-events-auto" : "pointer-events-none"
        }`}
    >
      <style>{CURTAIN_KEYFRAMES}</style>

      {/* =====================================================
          TOP PANEL
          ===================================================== */}

      <div
        style={topPanelStyle}
        className="fixed inset-x-0 top-0 z-[1000] h-1/2 overflow-hidden bg-black"
      >
       

        <div
          style={textStyle}
          className="absolute inset-x-0 bottom-0 flex translate-y-1/2 items-center justify-center px-4 text-center"
        >
          {BRAND_TAG && (
            <span className="absolute bottom-[calc(100%+1rem)] whitespace-nowrap text-[0.65rem] font-semibold tracking-[0.45em] text-white/70 sm:bottom-[calc(100%+1.25rem)] sm:text-xs">
              {BRAND_TAG}
            </span>
          )}

          <span
            style={brandShift}
            className="font-wiecode relative whitespace-nowrap text-[clamp(1.5rem,7.5vw,5rem)] font-bold leading-none tracking-[0.12em] text-white"
          >
            {BRAND_NAME}{" "}
            <span className="text-[#C21891]">{BRAND_YEAR}</span>
          </span>
        </div>
      </div>

      {/* =====================================================
          BOTTOM PANEL
          ===================================================== */}

      <div
        style={bottomPanelStyle}
        onAnimationEnd={handleAnimationEnd}
        className="fixed inset-x-0 bottom-0 z-[1000] h-1/2 overflow-hidden bg-black"
      >
       

        <div
          style={textStyle}
          className="absolute inset-x-0 top-0 flex -translate-y-1/2 items-center justify-center px-4 text-center"
        >
          <span
            style={brandShift}
            className="font-wiecode relative whitespace-nowrap text-[clamp(1.5rem,7.5vw,5rem)] font-bold leading-none tracking-[0.12em] text-white"
          >
            {BRAND_NAME}{" "}
            <span className="text-[#C21891]">{BRAND_YEAR}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export function Curtain({
  mode = "release",
  leaving = false,
  subtitle = "",
  onAnimationDone,
}) {
  if (typeof document === "undefined") {
    return null;
  }

  const phase =
    leaving || mode === "closing" || mode === "close"
      ? "closing"
      : mode === "hold"
        ? "hold"
        : "release";

  return createPortal(
    <CurtainView
      phase={phase}
      subtitle={subtitle}
      onDone={onAnimationDone}
    />,
    document.body
  );
}

/* =========================================================
   ROUTE HANDOFF CURTAIN
   ========================================================= */

function mountHandoff(subtitle) {
  const container = document.createElement("div");

  document.body.appendChild(container);

  const root = createRoot(container);

  let setPhaseFn = null;
  let done = false;
  let failsafe = null;

  const cleanup = () => {
    if (done) return;

    done = true;

    clearTimeout(failsafe);

    setTimeout(() => {
      root.unmount();
      container.remove();
    }, 0);
  };

  const release = () => {
    clearTimeout(failsafe);

    if (setPhaseFn) {
      setPhaseFn("release");

      setTimeout(cleanup, OPEN_MS + OPEN_DELAY + 500);
    } else {
      cleanup();
    }
  };

  function Host() {
    const [phase, setPhase] = useState("closing");

    useEffect(() => {
      setPhaseFn = setPhase;

      return () => {
        setPhaseFn = null;
      };
    }, []);

    return (
      <CurtainView
        phase={phase}
        subtitle={subtitle}
        onDone={cleanup}
      />
    );
  }

  flushSync(() => {
    root.render(<Host />);
  });

  failsafe = setTimeout(release, NAVIGATE_AT + 5000);

  return { release };
}

/* =========================================================
   ALIGN DOMAINS
   ========================================================= */

const alignToDomains = () => {
  let frames = 0;

  const step = () => {
    const section = document.getElementById("domains");

    if (section) {
      withInstantScroll(() => {
        section.scrollIntoView({
          block: "start",
          behavior: "instant",
        });
      });

      ensureDocumentScrollbar();

      return;
    }

    frames += 1;

    if (frames < 40) {
      requestAnimationFrame(step);
    } else {
      ensureDocumentScrollbar();
    }
  };

  requestAnimationFrame(step);
};

let handoffUntil = 0;

/* =========================================================
   EXIT NAVIGATION
   ========================================================= */

export function useExitNavigation() {
  const navigate = useNavigate();

  const timer = useRef(null);
  const handoffRef = useRef(null);
  const busy = useRef(false);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      handoffRef.current?.release();
    };
  }, []);

  const goTo = useCallback(
    (to, subtitle = "") =>
      (event) => {
        if (
          event?.type === "click" &&
          (event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey)
        ) {
          return;
        }

        event?.preventDefault?.();

        if (busy.current) {
          return;
        }

        const toDomains =
          typeof to === "object" && to?.hash === "#domains";

        if (
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
          ensureDocumentScrollbar();

          navigate(to);

          if (toDomains) {
            alignToDomains();
          }

          return;
        }

        busy.current = true;

        const handoff = mountHandoff(subtitle);

        handoffRef.current = handoff;

        timer.current = setTimeout(() => {
          timer.current = null;
          busy.current = false;
          handoffRef.current = null;

          handoffUntil = Date.now() + 2000;

          ensureDocumentScrollbar();

          navigate(to);

          if (toDomains) {
            alignToDomains();
          }

          setTimeout(() => {
            if (toDomains) {
              alignToDomains();
            }

            handoff.release();
          }, HOME_WAIT);
        }, NAVIGATE_AT);
      },
    [navigate]
  );

  return goTo;
}

/* =========================================================
   BACK LINK
   ========================================================= */

function BackLink({ onClick }) {
  return (
    <Button
      onClick={onClick}
      aria-label="Back to Domains"
      className="font-subheading mt-3 sm:mt-0"
    >
      Back to Domains
    </Button>
  );
}

/* =========================================================
   BACKDROP
   ========================================================= */

function Backdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#C21891] to-transparent shadow-[0_0_20px_#C21891]" />
    </div>
  );
}

/* =========================================================
   404
   ========================================================= */

function NotFound() {
  const goTo = useExitNavigation();
  const entered = useEntered(350);

  const content = (
    <main className="relative min-h-[100dvh] w-full overflow-x-hidden bg-black px-5 py-10 text-white">
      <Curtain subtitle="Domain not found" />

      <Backdrop />

      <div className="mx-auto w-full max-w-xl text-center">
        <p
          className={`${REVEAL} ${entered ? SHOWN : HIDDEN
            } text-[clamp(5rem,26vw,10rem)] font-semibold leading-none tracking-tighter text-[#C21891]`}
          style={stagger(entered, 0)}
        >
          404
        </p>

        <h1
          className={`${REVEAL} ${entered ? SHOWN : HIDDEN
            } mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl`}
          style={stagger(entered, 1)}
        >
          Domain not found
        </h1>

        <p
          className={`${REVEAL} ${entered ? SHOWN : HIDDEN
            } font-paragraph mx-auto mt-4 max-w-sm !text-base leading-relaxed text-white/70`}
          style={stagger(entered, 2)}
        >
          This challenge doesn&apos;t exist. Head back and explore the
          domains.
        </p>

        <div
          className={`${REVEAL} ${entered ? SHOWN : HIDDEN
            } mt-10`}
          style={stagger(entered, 3)}
        >
          <BackLink onClick={goTo(BACK_TO)} />
        </div>
      </div>
    </main>
  );

  /*
   * IMPORTANT:
   * Do NOT portal the page itself.
   * The page must remain inside App's normal layout so the Footer
   * stays AFTER the domain content.
   */
  return content;
}

/* =========================================================
   DOMAIN VIEW
   ========================================================= */

function DomainView({ domain, revealAfter, onBack }) {
  const entered = useEntered(revealAfter);

  const show = entered ? SHOWN : HIDDEN;

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col px-5 pb-5 pt-10 sm:px-8 sm:py-6 lg:px-12">
      {/* TOP BAR */}
      <div
        className={`${REVEAL} ${show} flex items-center justify-between`}
        style={stagger(entered, 0)}
      >
        <BackLink onClick={onBack} />
      </div>

      {/* MAIN */}
      <section className="flex flex-1 flex-col justify-center gap-6 py-6 sm:gap-8">
        {/* HEADER */}
        <header>
          <h1
            className={`${REVEAL} ${show} font-subheading break-words text-center text-[clamp(2rem,6.5vw,4.75rem)] font-semibold leading-[1] tracking-tight text-white sm:text-left`}
            style={stagger(entered, 1)}
          >
            {domain.title}
          </h1>

          <div
            aria-hidden="true"
            className={`
              mt-5 h-[2px] w-full origin-left
              bg-gradient-to-r from-[#C21891] via-[#C21891]/50 to-transparent
              transition-transform duration-[1100ms]
              ease-[cubic-bezier(0.22,1,0.36,1)]
              motion-reduce:transition-none sm:mt-7
              ${entered
                ? "scale-x-100"
                : "scale-x-0 motion-reduce:scale-x-100"
              }
            `}
            style={stagger(entered, 2)}
          />
        </header>

        {/* ONE CONTENT SECTION */}
        <div
          className={`${REVEAL} ${show}`}
          style={stagger(entered, 4)}
        >
          <div className="relative overflow-hidden rounded-2xl border border-[#C21891]/40 bg-gradient-to-br from-[#C21891]/[0.08] via-black to-black p-6 transition-colors duration-500 hover:border-[#C21891] sm:p-8 lg:p-10">
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 h-full w-[3px] bg-[#C21891]"
            />

            <section aria-labelledby="domain-challenge">
              <h2
  id="domain-challenge"
  className="font-subheading mb-4 !text-base font-semibold tracking-normal text-[#C21891] sm:!text-lg"
>
  The challenge
</h2>

              <p className="font-paragraph !text-base leading-relaxed text-white sm:!text-lg lg:!text-xl">
                {domain.fullDescription}
              </p>
            </section>

            <div
              aria-hidden="true"
              className="my-6 h-px w-full bg-gradient-to-r from-[#C21891]/70 via-[#C21891]/20 to-transparent sm:my-8"
            />

            <section aria-labelledby="domain-example">
              <h2
                id="domain-example"
                className="font-subheading mb-4 !text-base font-semibold tracking-normal text-[#FF5BCB] sm:!text-lg"
              >
                Example solution
              </h2>

              <p className="font-paragraph !text-base leading-relaxed text-white/80 sm:!text-lg lg:!text-xl">
                {domain.example}
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   MAIN PAGE
   ========================================================= */

export default function DomainDescriptionPage() {
  const { domainId } = useParams();

  const index = domains.findIndex(
    (domain) => domain.id === domainId
  );

  const domain = domains[index];

  const goTo = useExitNavigation();

  /*
   * If the page was opened through the domain-card handoff,
   * the handoff curtain is already covering the screen.
   */
  const introRef = useRef({
    id: null,
    skip: false,
  });

  if (introRef.current.id !== domainId) {
    introRef.current = {
      id: domainId,
      skip: Date.now() < handoffUntil,
    };
  }

  const skipIntro = introRef.current.skip;

  const goToRef = useRef(goTo);

  goToRef.current = goTo;

  useHideMoveToTop();

  /*
   * Keep the browser scrollbar permanently allocated.
   * The document itself is the ONLY scroll container, so the thumb
   * automatically matches Navbar + page + Footer height.
   */
  useIsoLayoutEffect(() => {
    ensureDocumentScrollbar();

    return () => {
      /*
       * Keep scrollbar allocated when leaving the domain as well.
       * This prevents the scrollbar from blinking during navigation.
       */
      ensureDocumentScrollbar();
    };
  }, [domainId]);

  /* Escape key -> back to domains */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== "Escape") {
        return;
      }

      goToRef.current(BACK_TO)(event);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /*
   * Start the domain page from the top, instantly (no smooth
   * scroll animation while the curtain is covering the screen).
   */
  useIsoLayoutEffect(() => {
    jumpToTop();
  }, [domainId]);

  /* Invalid domain */
  if (!domain) {
    return <NotFound />;
  }

  /*
   * IMPORTANT:
   *
   * Do NOT use createPortal here.
   *
   * Keeping this inside the normal React route means:
   *
   * Navbar
   *    ↓
   * Domain page
   *    ↓
   * Footer
   *
   * This keeps the footer after the domain page.
   */
  return (
    <main className="relative z-[998] isolate min-h-[100dvh] w-full overflow-x-hidden bg-black text-white">
      <Background
        density={0.9}
        colors={["#ffffff", "#FF4DB8", "#E6007E"]}
        speed={1}
        fixed={false}
      />

      <Backdrop />

      {!skipIntro && <Curtain key={domainId} />}

      <DomainView
        key={domain.id}
        domain={domain}
        revealAfter={OPEN_DELAY + 250}
        onBack={goTo(BACK_TO)}
      />
    </main>
  );
}