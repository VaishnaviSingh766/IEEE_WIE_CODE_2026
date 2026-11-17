import {
  FileText,
  Lightbulb,
  Medal,
  Trophy,
  Venus,
} from "lucide-react";
import "../cssfiles/font.css";
import Background from "../utils/Background";

const prizes = [
  {
    title: "SECOND PRIZE",
    amount: "₹10,000/-",
    icon: Medal,
    compact: true,
    position:
      "left-1/2 top-[44%] -translate-x-1/2 lg:left-0 lg:top-[18%] lg:translate-x-0",
  },
  {
    title: "BEST WOMEN TEAM",
    amount: "₹5,000/-",
    icon: Venus,
    compact: true,
    position:
      "left-1/2 top-[59%] -translate-x-1/2 lg:right-0 lg:top-[18%] lg:left-auto lg:translate-x-0",
  },
  {
    title: "BEST YOUNG MINDS",
    amount: "₹3,000/-",
    icon: Lightbulb,
    position:
      "left-1/2 top-[74%] -translate-x-1/2 lg:bottom-[2%] lg:left-[14%] lg:top-auto lg:translate-x-0",
  },
  {
    title: "BEST ABSTRACT",
    amount: "₹2,000/-",
    icon: FileText,
    position:
      "left-1/2 top-[89%] -translate-x-1/2 lg:right-[14%] lg:bottom-[2%] lg:left-auto lg:top-auto lg:translate-x-0",
  },
];

function PrizeCard({
  title,
  amount,
  icon: Icon,
  compact,
  position,
}) {
  return (
    <article
      className={`group absolute z-10 flex flex-row justify-center overflow-hidden border border-[#c21891]/80 bg-[linear-gradient(135deg,rgba(194,24,145,0.08),transparent_28%,transparent_72%,rgba(194,24,145,0.06))] bg-black px-2 py-2 text-center shadow-[0_0_18px_rgba(194,24,145,0.18)] transition-colors duration-300 hover:border-[#c21891] ${
        compact
          ? "h-[135px] w-[calc(100%-2rem)] rounded-2xl lg:h-[125px] lg:w-[230px] lg:rounded-none"
          : "h-[135px] w-[calc(100%-2rem)] rounded-2xl lg:h-[135px] lg:w-[260px] lg:rounded-none"
      } flex-row items-center px-5 py-3 lg:flex-col lg:px-4 lg:py-3 ${position}`}
    >
      <span className="absolute inset-y-0 left-0 w-1 bg-[#c21891] shadow-[0_0_12px_#c21891]" />
      <span className="absolute -left-px -top-px hidden h-4 w-4 border-l-2 border-t-2 border-[#c21891] lg:block" />
      <span className="absolute -bottom-px -right-px hidden h-4 w-4 border-b-2 border-r-2 border-[#c21891] lg:block" />
      <span className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(transparent_94%,rgba(194,24,145,0.35)_95%,transparent_96%)] [background-size:100%_8px]" />
      <div className="mb-0 mr-5 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#c21891]/40 bg-[#c21891]/[0.06] text-[9px] tracking-[0.18em] text-[#c21891] lg:absolute lg:right-4 lg:top-3 lg:mb-0 lg:mr-0 lg:h-auto lg:w-auto lg:justify-between lg:rounded-none lg:border-0 lg:bg-transparent">
        <Icon className="h-8 w-8 text-[#ff8cda] lg:h-4 lg:w-4 lg:text-[#c21891]" strokeWidth={2.5} />
      </div>
      <span className="mr-5 h-16 w-px shrink-0 bg-[#c21891]/60 lg:hidden" />
      <div className="min-w-0 flex-1 lg:flex-none">
        <h3 className="font-subheading text-left text-[16px] font-bold uppercase tracking-[0.03em] text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.35)] lg:text-center lg:text-[17px]">
          {title}
        </h3>
        <p className="font-numbers mt-1 !text-[22px] text-left !font-black tracking-[0.02em] text-[#ff4db8] drop-shadow-[0_0_8px_rgba(194,24,145,0.75)] lg:mt-2 lg:text-center lg:!text-[21px]">
          {amount}
        </p>
      </div>
      <span className="mx-auto mt-1 hidden h-px w-16 bg-[#c21891]/60 lg:block" />
    </article>
  );
}

export default function Prizing() {
  return (
    <section
      id="prizes"
      className="relative isolate overflow-hidden bg-black px-2 pb-8 pt-[84px] text-white lg:px-8 lg:py-6"
    >
      <Background
        density={1.2}
        colors={["#ffffff", "#ff4db8", "#e6007e"]}
        className="opacity-60"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 [background-image:linear-gradient(rgba(194,24,145,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(194,24,145,0.08)_1px,transparent_1px)] [background-size:10px_10px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c21891]/10 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-[1100px]">
        <div className="relative mb-3 text-center lg:mb-5">
          <h2 className="font-heading font-black tracking-normal text-white drop-shadow-[0_0_12px_rgba(194,24,145,0.7)]">
            <span className="lg:hidden">PRIZE POOL</span>
            <span className="hidden lg:inline">PRIZES</span>
          </h2>
          <div className="mx-auto mt-3 h-px w-20 bg-[#c21891] shadow-[0_0_10px_#c21891] lg:mt-4 lg:w-28" />
        </div>

        <div className="relative mx-auto h-[1040px] max-w-[1100px] lg:h-[580px]">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 h-full w-full"
            viewBox="0 0 1000 760"
            preserveAspectRatio="none"
          >
            <g
              className="hidden"
              fill="none"
              stroke="#c21891"
              strokeDasharray="8 8"
              strokeLinecap="round"
              strokeOpacity="0.42"
              strokeWidth="1"
            >
              <path d="M500 146 L500 323" />
              <path d="M105 286 L425 390" />
              <path d="M895 286 L575 390" />
              <path d="M195 552 L447 470" />
              <path d="M805 552 L553 470" />
            </g>
            <g
              className="hidden"
              fill="#000000"
              stroke="#c21891"
              strokeWidth="1"
            >
              <circle cx="500" cy="323" r="4" />
              <circle cx="425" cy="390" r="4" />
              <circle cx="575" cy="390" r="4" />
              <circle cx="447" cy="470" r="4" />
              <circle cx="553" cy="470" r="4" />
            </g>
            <g
              className="hidden lg:block"
              fill="none"
              stroke="#c21891"
              strokeDasharray="8 8"
              strokeLinecap="round"
              strokeOpacity="0.42"
              strokeWidth="1"
            >
              <path d="M500 203 L500 282" />
              <path d="M236 293 L398 324" />
              <path d="M764 293 L602 324" />
              <path d="M376 655 L420 550" />
              <path d="M624 655 L580 550" />
            </g>
          </svg>
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[14%] z-0 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 overflow-visible lg:hidden"
            viewBox="0 0 200 200"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="mobile-pool-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle
              cx="100"
              cy="100"
              r="98"
              fill="none"
              stroke="#c21891"
              strokeOpacity="0.14"
              strokeWidth="2"
            />
            <circle
              cx="100"
              cy="100"
              r="98"
              fill="none"
              stroke="#ff8dda"
              strokeLinecap="round"
              strokeDasharray="84 532"
              strokeDashoffset="-28"
              strokeWidth="3"
              filter="url(#mobile-pool-glow)"
            />
            <circle
              cx="100"
              cy="100"
              r="98"
              fill="none"
              stroke="#ff8dda"
              strokeLinecap="round"
              strokeDasharray="92 524"
              strokeDashoffset="-300"
              strokeWidth="3"
              filter="url(#mobile-pool-glow)"
            />
          </svg>
          <div className="absolute left-1/2 top-[14%] hidden h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c21891]/50 shadow-[0_0_45px_rgba(194,24,145,0.22)] lg:block lg:top-[56%] lg:h-[220px] lg:w-[220px]" />
          <div className="absolute left-1/2 top-[14%] z-10 flex h-[156px] w-[156px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black text-center shadow-[inset_0_0_28px_rgba(194,24,145,0.12),0_0_45px_rgba(194,24,145,0.22)] lg:top-[56%] lg:h-[140px] lg:w-[140px] lg:border-[#c21891]/50 lg:shadow-[0_0_45px_rgba(194,24,145,0.22)]">
            <div className="flex h-full flex-col items-center justify-center">
              <Trophy className="mb-2 h-8 w-8 text-[#ff8cda] lg:hidden" />
              <span className="font-paragraph !text-[9px] tracking-[0.18em] text-white">TOTAL POOL</span>
              <strong className="font-numbers whitespace-nowrap !text-[25px] !font-black tracking-[-0.04em] text-[#ff4db8] lg:!text-[23px]">
                ₹35,000/-
              </strong>
            </div>
          </div>

          <div
            className="absolute left-1/2 top-[29%] z-10 flex h-[135px] w-[calc(100%-2rem)] -translate-x-1/2 flex-row items-center overflow-hidden rounded-2xl border border-[#c21891]/80 bg-black px-5 py-3 text-left shadow-[0_0_18px_rgba(194,24,145,0.18)] lg:top-0 lg:h-[155px] lg:w-[300px] lg:flex-col lg:items-center lg:justify-center lg:rounded-none lg:px-5 lg:py-4 lg:text-center"
          >
            <span className="absolute inset-y-0 left-0 w-1 bg-[#c21891] shadow-[0_0_12px_#c21891]" />
            <span className="absolute -left-px -top-px hidden h-4 w-4 border-l-2 border-t-2 border-[#c21891] lg:block" />
            <span className="absolute -bottom-px -right-px hidden h-4 w-4 border-b-2 border-r-2 border-[#c21891] lg:block" />
            <span className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(transparent_94%,rgba(194,24,145,0.35)_95%,transparent_96%)] [background-size:100%_8px]" />
            <div className="mb-0 mr-5 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#c21891]/40 bg-[#c21891]/[0.06] text-[9px] tracking-[0.18em] text-[#c21891] lg:absolute lg:right-4 lg:top-3 lg:mb-0 lg:mr-0 lg:h-auto lg:w-auto lg:justify-between lg:rounded-none lg:border-0 lg:bg-transparent">
              <Trophy className="h-8 w-8 text-[#ff8cda] lg:h-4 lg:w-4 lg:text-[#c21891]" />
            </div>
            <span className="mr-5 h-16 w-px shrink-0 bg-[#c21891]/60 lg:hidden" />
            <div className="min-w-0 flex-1 lg:flex-none lg:text-center">
              <h3 className="font-subheading text-[16px] font-bold text-white lg:text-[18px]">FIRST PRIZE</h3>
              <p className="font-numbers mt-1 !text-[22px] !font-black text-[#ff4db8] lg:mt-2 lg:!text-[24px]">
                ₹15,000/-
              </p>
            </div>
          </div>

          {prizes.map((prize, index) => (
            <PrizeCard
              key={prize.title}
              {...prize}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
