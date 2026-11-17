import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../cssfiles/Navbar.css';
import '../cssfiles/font.css';

/* Logos live in src/assets/logos — adjust the path if this file sits somewhere else */
import collegeLogo from '../assets/logos/college-logo.png';
import ieeeLogo from '../assets/logos/ieee-logo.png';
import bangaloreSection from '../assets/logos/bangalore-section.png';
import wieLogo from '../assets/logos/wie-logo.png';
import computerSociety from '../assets/logos/computer-society.png';

/* ═══ Logo arrangement (left → right) ═══ */
const logosData = [
  { src: collegeLogo, alt: 'College Logo', height: 'h-9 sm:h-11 lg:h-14' },
  { src: ieeeLogo, alt: 'IEEE Logo', height: 'h-7 sm:h-9 lg:h-10' },
  { src: bangaloreSection, alt: 'IEEE Bangalore Section', height: 'h-6 sm:h-8 lg:h-9' },
  { src: wieLogo, alt: 'IEEE WIE', height: 'h-6 sm:h-8 lg:h-9' },
  { src: computerSociety, alt: 'IEEE Computer Society', height: 'h-6 sm:h-8 lg:h-9' },
];

/* ═══ Centralised logo links — paste real URLs here ═══ */
const LOGO_LINKS = [
  { name: 'Siddaganga Institute of Technology', url: 'https://sit.ac.in/' },
  { name: 'IEEE', url: 'https://www.ieee.org/' },
  { name: 'IEEE Bangalore Section', url: 'https://ieeebangalore.org/' },
  { name: 'IEEE Women in Engineering', url: 'https://wie.ieee.org/' },
  { name: 'IEEE Computer Society', url: 'https://www.computer.org/' },
];


const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: 'home' },
  { label: 'About Us', href: '/about', icon: 'about' },
  { label: 'Contact Us', href: '/contact', icon: 'contact' },
  { label: 'Register Now', href: '/register', icon: 'register' },
  { label: 'Call for Volunteers', href: '/volunteers', icon: 'volunteer' },
];

/* Fluid Dissolve: tell the CSS where along the word the pointer / finger entered */
function setDissolveOrigin(e) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--x', `${((e.clientX - r.left) / r.width) * 100}%`);
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  /* the current page comes straight from the URL, so it is always right (also on refresh / back button) */
  const isCurrent = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  /* Esc closes the menu; it also closes when the screen grows to desktop size */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    const mq = window.matchMedia('(min-width: 1025px)');
    const onMq = (m) => { if (m.matches) setOpen(false); };
    document.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => {
      document.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
    };
  }, []);

  /* lock page scroll while the full-screen menu is open */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <div className={`wnav-root${open ? ' is-open' : ''}`}>
      <header className="wnav">
        {/* five logos, each one links out in a new tab */}
        <div className="wnav-logos">
          {logosData.map((logo, i) => (
            <a
              key={logo.alt}
              href={LOGO_LINKS[i].url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={LOGO_LINKS[i].name}
              className="wnav-logo-link"
            >
              <img src={logo.src} alt={logo.alt} className={`wnav-logo-img ${logo.height}`} />
            </a>
          ))}
        </div>

        {/* large screens: icons, full name appears on hover */}
        <ul className="wnav-links">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                className={`wnav-link font-subheading${isCurrent(item.href) ? ' active' : ''}`}
                to={item.href}
                aria-label={item.label}
                aria-current={isCurrent(item.href) ? 'page' : undefined}
              >
                <span className={`wnav-ico i-${item.icon}`} />
                <span className="wnav-label font-subheading">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* small + medium screens: stairs button */}
        <button
          type="button"
          className="wnav-stairs"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="wnav-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>
      </header>

      {/* small + medium screens: circular glass menu */}
      <nav className="wnav-menu" id="wnav-menu" aria-label="Main menu">
        <div className="wnav-stage">
          <div className="wnav-orb a" />
          <div className="wnav-orb b" />
          <div className="wnav-glass">
            <ul className="wnav-menu-list">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    className={`wnav-menu-link font-subheading${isCurrent(item.href) ? ' active' : ''}`}
                    to={item.href}
                    aria-current={isCurrent(item.href) ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                    onPointerEnter={setDissolveOrigin}
                    onPointerDown={setDissolveOrigin}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}