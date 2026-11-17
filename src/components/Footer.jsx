import React from 'react';
import '../cssfiles/font.css';

// Inline SVG icons keep this footer independent of icon package versions.
function FooterIcon({ size = 19, strokeWidth = 1.7, children, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

function Instagram(props) {
  return (
    <FooterIcon {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </FooterIcon>
  );
}

function Linkedin(props) {
  return (
    <FooterIcon {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </FooterIcon>
  );
}

function Youtube(props) {
  return (
    <FooterIcon {...props}>
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="m10 9 5 3-5 3Z" />
    </FooterIcon>
  );
}

function Send(props) {
  return (
    <FooterIcon {...props}>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </FooterIcon>
  );
}

function Mail(props) {
  return (
    <FooterIcon {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 6 10 7L22 6" />
    </FooterIcon>
  );
}

function ArrowUpRight(props) {
  return (
    <FooterIcon {...props}>
      <path d="M7 7h10v10M7 17 17 7" />
    </FooterIcon>
  );
}

// Public branch accounts from the supplied references; override if required.
export const DEFAULT_SOCIALS = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/ieee-sit-student-branch-official',
    icon: 'linkedin',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/ieeesitsb/',
    icon: 'instagram',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@tech-nomadsieeesitsb638',
    icon: 'youtube',
  },
  { label: 'Telegram', href: 'https://t.me/ieeesitsb', icon: 'telegram' },
  { label: 'Email', href: 'mailto:ieee@sit.ac.in', icon: 'mail' },
];
const icons = {
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube,
  telegram: Send,
  mail: Mail,
};

export default function Footer({
  year = new Date().getFullYear(),
  brand = 'IEEE SIT',
  subtitle = 'Student Branch',
  copyrightName = 'IEEE SIT Student Branch',
  socialLinks = DEFAULT_SOCIALS,
}) {
  return (
    <footer
      className="wie-footer relative bg-black text-white"
    >
      <style>{footerStyles}</style>
      <div className="wie-divider" aria-hidden="true" />
      <div className="wie-inner mx-auto w-full max-w-[1120px]">
        <div className="wie-row flex items-center justify-between">
          <div className="wie-identity">
            <h2 className="wie-brand font-subheading">{brand}</h2>
            <p className="wie-subtitle font-subheading">{subtitle}</p>
            <span className="wie-brand-rule" aria-hidden="true" />
          </div>
          {socialLinks.length > 0 && (
            <div className="wie-connect">
              <h3 className="wie-follow font-subheading">FOLLOW US</h3>
              <ul
                className="wie-socials flex flex-wrap items-center"
                aria-label="Social accounts"
              >
                {socialLinks.map(({ label, href, icon }) => {
                  const Icon = icons[icon] || ArrowUpRight;
                  const external = /^https?:\/\//i.test(href);
                  return (
                    <li key={label}>
                      <a
                        className="wie-social-link grid place-items-center"
                        href={href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noopener noreferrer' : undefined}
                        aria-label={`${label}${external ? ' (opens in a new tab)' : ''}`}
                      >
                        <Icon size={19} strokeWidth={1.7} aria-hidden="true" />
                        <span className="wie-tooltip" aria-hidden="true">
                          {label}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="wie-copyright">
        <p className="font-paragraph">
          © {year} {copyrightName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// Footer styles are kept here so only this JSX file is needed.
const footerStyles = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

@font-face {
  font-family: 'FooterSubheading';
  src: url('/fonts/Subheading.otf') format('opentype');
  font-style: normal;
  font-weight: 700;
  font-display: swap;
}
/* Exactly three base colors. All transparency derives from these colors. */
.wie-footer {
  --wie-black: #000000;
  --wie-magenta: #c21891;
  --wie-white: #ffffff;
  font-family: 'Space Grotesk', sans-serif;
  container-type: inline-size;
  container-name: wie-footer;
  color-scheme: dark;
  isolation: isolate;
}
.wie-footer *,
.wie-footer *::before,
.wie-footer *::after {
  box-sizing: border-box;
}
.wie-footer p,
.wie-footer h2,
.wie-footer h3 {
  margin: 0;
}
.wie-footer a {
  color: inherit;
  text-decoration: none;
}
.wie-footer a:focus-visible {
  outline: 2px solid var(--wie-white);
  outline-offset: 5px;
}
.wie-divider {
  height: 1px;
  background: var(--wie-magenta);
  position: relative;
}
.wie-divider::after {
  content: '';
  position: absolute;
  height: 1px;
  width: 72px;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background: var(--wie-magenta);
  box-shadow: 0 0 15px var(--wie-magenta);
  transition:
    width 0.45s ease,
    box-shadow 0.45s ease;
}
.wie-inner {
  padding-inline: 48px;
}
.wie-row {
  gap: 40px;
  padding-block: 39px 33px;
}
.wie-brand {
  font-family: 'FooterSubheading', sans-serif;
  font-size: 36px;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: 0.12em;
}
.wie-subtitle {
  margin-top: 8px !important;
  font-size: 14px;
  line-height: 1.5;
  letter-spacing: 0.045em;
}
.wie-brand-rule {
  display: block;
  margin-top: 16px;
  width: 38px;
  height: 2px;
  background: var(--wie-magenta);
  transition: width 0.25s ease;
}
.wie-follow {
  font-size: 11px;
  line-height: 1.6;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-align: right;
}
.wie-socials {
  list-style: none;
  padding: 0;
  margin: 14px 0 0;
  gap: 12px;
  justify-content: flex-end;
}
.wie-social-link {
  width: 44px;
  height: 44px;
  position: relative;
  border: 1px solid var(--wie-magenta);
  border-radius: 50%;
  background: var(--wie-black);
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}
.wie-social-link svg {
  position: relative;
  z-index: 1;
}
.wie-social-link::before {
  content: '';
  position: absolute;
  inset: -5px;
  border: 1px solid;
  border-color: var(--wie-magenta) var(--wie-magenta) transparent transparent;
  border-radius: 50%;
  opacity: 0;
  transform: rotate(-45deg);
  transition:
    opacity 0.2s ease,
    transform 0.5s ease;
  pointer-events: none;
}
.wie-tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  white-space: nowrap;
  background: var(--wie-black);
  border: 1px solid var(--wie-magenta);
  padding: 3px 7px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
}
.wie-social-link:focus-visible .wie-tooltip {
  opacity: 1;
}
.wie-social-link:focus-visible::before {
  opacity: 1;
  transform: rotate(135deg);
}
.wie-footer:focus-within .wie-divider::after {
  width: 140px;
  box-shadow: 0 0 22px var(--wie-magenta);
}
.wie-copyright {
  border-top: 1px solid var(--wie-magenta);
  text-align: center;
  padding: 15px 24px;
}
.wie-copyright p {
  color: var(--wie-white);
  font-size: 11px;
  line-height: 1.7;
  opacity: 0.8;
  letter-spacing: 0.025em;
}
@media (hover: hover) {
  .wie-identity:hover .wie-brand-rule {
    width: 64px;
  }
  .wie-social-link:hover {
    transform: translateY(-3px);
    background: var(--wie-magenta);
    box-shadow: 0 5px 20px #c2189133;
  }
  .wie-social-link:hover .wie-tooltip {
    opacity: 1;
  }
}
@media (hover: hover) {
  .wie-social-link:hover::before {
    opacity: 1;
    transform: rotate(135deg);
  }
  .wie-footer:hover .wie-divider::after {
    width: 140px;
    box-shadow: 0 0 22px var(--wie-magenta);
  }
}
@container wie-footer (max-width:600px) {
  .wie-inner {
    padding-inline: 24px;
  }
  .wie-row {
    flex-direction: column;
    text-align: center;
    gap: 28px;
    padding-block: 32px 30px;
  }
  .wie-brand {
    font-size: 30px;
  }
  .wie-brand-rule {
    margin-inline: auto;
  }
  .wie-follow {
    text-align: center;
  }
  .wie-socials {
    justify-content: center;
    gap: 12px;
  }
  .wie-copyright p {
    font-size: 10px;
  }
}
@container wie-footer (max-width:350px) {
  .wie-socials {
    gap: 9px;
  }
  .wie-inner {
    padding-inline: 18px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .wie-footer *,
  .wie-footer *::before,
  .wie-footer *::after {
    transition: none !important;
    animation: none !important;
  }
}

/* Layered shades are mixed only from the approved black, magenta and white. */
.wie-footer {
  background:
    radial-gradient(
      ellipse at 8% 0%,
      color-mix(in srgb, var(--wie-magenta) 28%, var(--wie-black)),
      transparent 60%
    ),
    radial-gradient(
      ellipse at 94% 100%,
      color-mix(in srgb, var(--wie-magenta) 18%, var(--wie-black)),
      transparent 54%
    ),
    var(--wie-black);
}
.wie-footer::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-image: radial-gradient(
    circle,
    color-mix(in srgb, var(--wie-magenta) 42%, transparent) 0.75px,
    transparent 1px
  );
  background-size: 22px 22px;
  mask-image: linear-gradient(
    110deg,
    transparent 12%,
    var(--wie-black) 55%,
    transparent 96%
  );
  opacity: 0.48;
}
.wie-inner {
  position: relative;
}
.wie-row {
  padding-block: 46px 39px;
}
.wie-brand {
  color: var(--wie-white);
  text-shadow: 0 0 35px color-mix(in srgb, var(--wie-magenta) 22%, transparent);
}
.wie-subtitle {
  color: var(--wie-white);
}
.wie-brand-rule {
  background: linear-gradient(
    90deg,
    var(--wie-magenta),
    color-mix(in srgb, var(--wie-white) 45%, var(--wie-magenta)),
    transparent
  );
  width: 62px;
  box-shadow: 0 0 14px color-mix(in srgb, var(--wie-magenta) 45%, transparent);
}
.wie-follow::before {
  content: '';
  display: inline-block;
  width: 5px;
  height: 5px;
  margin: 0 9px 2px 0;
  border-radius: 50%;
  background: var(--wie-magenta);
  box-shadow: 0 0 11px var(--wie-magenta);
}
.wie-divider {
  overflow: hidden;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, var(--wie-magenta) 65%, transparent) 18%,
    var(--wie-magenta) 50%,
    color-mix(in srgb, var(--wie-magenta) 65%, transparent) 82%,
    transparent
  );
}
.wie-divider::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 -20%;
  width: 18%;
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, var(--wie-white) 80%, var(--wie-magenta)),
    transparent
  );
  opacity: 0;
}
.wie-divider::after {
  height: 2px;
}
.wie-social-link {
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--wie-magenta) 25%, var(--wie-black)),
    var(--wie-black) 76%
  );
  border-color: color-mix(in srgb, var(--wie-magenta) 75%, var(--wie-black));
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--wie-white) 9%, transparent),
    0 4px 14px color-mix(in srgb, var(--wie-black) 50%, transparent);
}
.wie-social-link svg {
  transition:
    transform 0.25s ease,
    filter 0.25s ease;
}
.wie-social-link::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 1px solid var(--wie-magenta);
  opacity: 0;
  pointer-events: none;
}
.wie-tooltip {
  border-radius: 4px;
  background: color-mix(in srgb, var(--wie-magenta) 16%, var(--wie-black));
}
.wie-copyright {
  position: relative;
  border-top: 0;
  background: color-mix(in srgb, var(--wie-black) 55%, transparent);
}
.wie-copyright::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, var(--wie-magenta) 65%, transparent) 28%,
    color-mix(in srgb, var(--wie-magenta) 65%, transparent) 72%,
    transparent
  );
}
.wie-social-link:focus-visible {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--wie-magenta) 72%, var(--wie-white)),
    var(--wie-magenta) 50%,
    color-mix(in srgb, var(--wie-magenta) 70%, var(--wie-black))
  );
  box-shadow: 0 0 23px color-mix(in srgb, var(--wie-magenta) 40%, transparent);
}
.wie-social-link:focus-visible::after {
  animation: wie-ripple 0.65s ease-out;
}
@media (hover: hover) {
  .wie-footer:hover .wie-divider::before {
    animation: wie-light-sweep 1.7s ease-out both;
  }
  .wie-identity:hover .wie-brand-rule {
    width: 98px;
  }
  .wie-social-link:hover {
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--wie-magenta) 72%, var(--wie-white)),
      var(--wie-magenta) 50%,
      color-mix(in srgb, var(--wie-magenta) 70%, var(--wie-black))
    );
    border-color: color-mix(in srgb, var(--wie-magenta) 70%, var(--wie-white));
    box-shadow:
      0 6px 25px color-mix(in srgb, var(--wie-magenta) 48%, transparent),
      inset 0 1px 0 color-mix(in srgb, var(--wie-white) 35%, transparent);
    transform: translateY(-4px);
  }
  .wie-social-link:hover svg {
    transform: scale(1.08);
    filter: drop-shadow(
      0 0 5px color-mix(in srgb, var(--wie-white) 35%, transparent)
    );
  }
  .wie-social-link:hover::after {
    animation: wie-ripple 0.65s ease-out;
  }
}
@keyframes wie-light-sweep {
  0% {
    left: -20%;
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  85% {
    opacity: 1;
  }
  100% {
    left: 102%;
    opacity: 0;
  }
}
@keyframes wie-ripple {
  0% {
    transform: scale(1);
    opacity: 0.65;
  }
  100% {
    transform: scale(1.38);
    opacity: 0;
  }
}
@container wie-footer (max-width:600px) {
  .wie-row {
    padding-block: 36px 34px;
  }
  .wie-footer::before {
    opacity: 0.3;
  }
}
@media (prefers-reduced-motion: reduce) {
  .wie-divider::before {
    display: none;
  }
  .wie-footer *,
  .wie-footer *::before,
  .wie-footer *::after {
    transition: none !important;
    animation: none !important;
  }
}
`;
