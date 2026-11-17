import React from "react";


import Button from "../utils/Button";
import Background from "../utils/Background";

// import campaColaImg from "../assets/sponsors/campacola-DlZVuhl--removebg-preview.png";
// import coconutImg from "../assets/sponsors/coconut-VZPBBvAw-removebg-preview.png";
// import paperboatImg from "../assets/sponsors/paperboat-Cyh4sJ32-removebg-preview.png";

const sponsors = [
  // {
  //   id: 1,
  //   name: "Campa Cola",
  //   logo: campaColaImg,
  //   url: "https://campa-cola.in",
  // },
  // {
  //   id: 2,
  //   name: "Coconut Fresh & Organic",
  //   logo: coconutImg,
  //   url: "https://example.com",
  // },
  // {
  //   id: 3,
  //   name: "Paper Boat",
  //   logo: paperboatImg,
  //   url: "https://paperboatfoods.com",
  // },
];

const openWebsite = (url) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

export default function Sponsor() {
  return (
    <section
      id="sponsors"
      aria-label="Our Sponsors"
      className="relative w-full overflow-hidden bg-black py-12 sm:py-16 md:py-20"
    >

      <Background />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Heading */}
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="font-heading">
            Our Sponsors
          </h2>
        </div>

        {/* Sponsor cards */}
        <div className="grid grid-cols-1 items-stretch justify-items-center gap-8 sm:grid-cols-3 sm:gap-5 lg:gap-8">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="sponsor-card group relative isolate flex w-full max-w-[360px] flex-col overflow-hidden border border-white/10 bg-[#0b0b0b] sm:max-w-none"
            >
              {/* Sponsor image - separate from the button */}
              <div className="sponsor-image-container relative flex w-full items-center justify-center">
                <img
                  src={sponsor.logo}
                  alt={`${sponsor.name} logo`}
                  className="sponsor-image select-none"
                  draggable={false}
                  loading="lazy"
                />
              </div>

              {/* Know Us button - below the image */}
              <div className="sponsor-button-container relative z-20 flex w-full justify-center">
                <Button
                  color="#C21891"
                  onClick={() => openWebsite(sponsor.url)}
                >
                  Know Us
                </Button>
              </div>

              {/* Pink glow */}
              <div
                aria-hidden="true"
                className="sponsor-glow pointer-events-none absolute inset-0 z-30 opacity-0"
              />

              {/* Glass reflection */}
              <div
                aria-hidden="true"
                className="sponsor-glass pointer-events-none absolute inset-0 z-20 opacity-0"
              />

              {/* Top-left corner */}
              <div
                aria-hidden="true"
                className="sponsor-corner sponsor-corner-tl pointer-events-none absolute left-1.5 top-1.5 z-40 h-4 w-4 opacity-0"
              />

              {/* Bottom-right corner */}
              <div
                aria-hidden="true"
                className="sponsor-corner sponsor-corner-br pointer-events-none absolute bottom-1.5 right-1.5 z-40 h-4 w-4 opacity-0"
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .sponsor-card {
          border-radius: 0;
          transform: translate3d(0, 0, 0) scale(1);
          transform-origin: center;
          backface-visibility: hidden;
          will-change: transform, box-shadow;

          box-shadow: 0 0 25px rgba(255, 255, 255, 0.06);

          transition:
            transform 650ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 500ms ease,
            box-shadow 700ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .sponsor-card:hover {
          transform: translate3d(0, 0, 0) scale(1.025);
          border-color: #C21891;

          box-shadow:
            0 0 0 1px rgba(194, 24, 145, 0.75),
            0 0 12px rgba(194, 24, 145, 0.3),
            0 0 30px rgba(194, 24, 145, 0.2);
        }

        /* Image area */
        .sponsor-image-container {
          height: 245px;
          padding: 18px 20px 8px;
          box-sizing: border-box;
          flex-shrink: 0;
        }

        .sponsor-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          pointer-events: none;
        }

        /* Button stays below the image */
        .sponsor-button-container {
          padding: 8px 12px 20px;
          box-sizing: border-box;
          flex-shrink: 0;
          opacity: 1;
          transition: opacity 350ms ease;
        }

        /* Reduce button dimensions */
        .sponsor-button-container button {
          width: 145px !important;
          min-width: 0 !important;
          max-width: 145px !important;
          height: 42px !important;
          min-height: 42px !important;
          padding: 0 12px !important;
          box-sizing: border-box !important;
          border-radius: 9px !important;

          font-family: "Paragraph", sans-serif !important;
          font-size: 14px !important;
          font-weight: 800 !important;
          letter-spacing: 1.5px !important;
          line-height: 1 !important;
        }

        /* Subtle button movement on hover */
        .sponsor-card:hover .sponsor-button-container {
          opacity: 1;
        }

        /* Pink outline glow */
        .sponsor-glow {
          background: transparent;
          box-shadow:
            inset 0 0 0 1px rgba(194, 24, 145, 0.8),
            0 0 18px rgba(194, 24, 145, 0.3),
            0 0 38px rgba(194, 24, 145, 0.16);

          transition: opacity 600ms ease;
        }

        .sponsor-card:hover .sponsor-glow {
          opacity: 1;
        }

        /* Glass reflection */
        .sponsor-glass {
          background: linear-gradient(
            125deg,
            rgba(255, 255, 255, 0.13) 0%,
            rgba(255, 255, 255, 0.04) 25%,
            transparent 55%,
            rgba(255, 255, 255, 0.03) 100%
          );

          transition: opacity 600ms ease;
        }

        .sponsor-card:hover .sponsor-glass {
          opacity: 1;
        }

        /* Corner accents */
        .sponsor-corner {
          border-color: #C21891;
          transition:
            opacity 450ms ease,
            transform 550ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .sponsor-corner-tl {
          border-top: 2px solid;
          border-left: 2px solid;
          transform: translate3d(-3px, -3px, 0);
        }

        .sponsor-corner-br {
          border-right: 2px solid;
          border-bottom: 2px solid;
          transform: translate3d(3px, 3px, 0);
        }

        .sponsor-card:hover .sponsor-corner {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        /* Responsive layout */
        @media (max-width: 768px) {
          .sponsor-image-container {
            height: 220px;
            padding: 16px 16px 8px;
          }

          .sponsor-button-container {
            padding: 6px 12px 16px;
          }

          .sponsor-button-container button {
            width: 130px !important;
            max-width: 130px !important;
            height: 38px !important;
            min-height: 38px !important;
            font-size: 11px !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sponsor-card,
          .sponsor-button-container,
          .sponsor-glow,
          .sponsor-glass,
          .sponsor-corner {
            transition: none !important;
          }

          .sponsor-card:hover {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}

export { Sponsor as Sponsors };