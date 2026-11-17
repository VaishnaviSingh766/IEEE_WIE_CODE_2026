<<<<<<< HEAD
# WIE CODE 2K26-27 — Frontend

A collaborative React website for the IEEE WIE Student Branch coding event.

## Tech Stack

- **React** (v19)
- **Vite** (v8)
- **Tailwind CSS** (v4)
- **React Router DOM** (v7)

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
frontend/
├── public/                    # Static files (PDFs, downloadable assets)
│   └── files/
│
├── src/
│   ├── assets/                # Images, icons, sponsors, fonts, prizes
│   │   ├── images/
│   │   ├── icons/
│   │   ├── sponsors/
│   │   ├── fonts/
│   │   └── prizes/
│   │
│   ├── components/            # Reusable components
│   │   ├── common/            # Button, Heading, Loader, Timer
│   │   ├── layout/            # Navbar, Footer
│   │   └── ui/                # Card, ParticleBackground, SplashCursor
│   │
│   ├── pages/                 # Route-level page components
│   │   ├── Home/              # Home.jsx + CurtainAnimation, CurtainBack, CurtainExplore
│   │   ├── About/             # About.jsx
│   │   ├── Events/            # Events.jsx
│   │   ├── Gallery/           # Gallery.jsx
│   │   ├── Sponsors/          # Sponsors.jsx
│   │   ├── Contact/           # Contact.jsx
│   │   └── Volunteers/        # Volunteers.jsx
│   │
│   ├── sections/              # Large page sections (separated for collaboration)
│   │   ├── home/              # HeroSection, TimelineSection
│   │   ├── about/             # DomainsSection, DomainCard, DetailsSection
│   │   ├── events/            # PrizingSection, RulesSection, FAQSection
│   │   ├── gallery/           # GallerySection
│   │   ├── sponsors/          # SponsorsSection
│   │   ├── contact/           # ContactSection
│   │   └── volunteers/        # VolunteerSection
│   │
│   ├── routes/                # Centralized routing
│   │   └── AppRoutes.jsx
│   │
│   ├── context/               # React Context providers
│   │   ├── LoaderContext.jsx
│   │   └── CurtainContext.jsx
│   │
│   ├── App.jsx                # App shell (Navbar + Routes + Footer)
│   ├── main.jsx               # React entry point with providers
│   └── index.css              # Global styles + Tailwind
│
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
└── .gitignore
```

## Developer Assignment Guide

Each developer should work primarily in their assigned folder:

| Developer | Primary Folder                    | Files                              |
| --------- | --------------------------------- | ---------------------------------- |
| Dev 1     | `src/pages/Home/`                 | Home.jsx, Curtain*, HeroSection    |
| Dev 2     | `src/pages/About/`               | About.jsx, DomainsSection, Details |
| Dev 3     | `src/pages/Events/`              | Events.jsx, Prizing, Rules, FAQ    |
| Dev 4     | `src/pages/Gallery/`             | Gallery.jsx, GallerySection        |
| Dev 5     | `src/pages/Sponsors/`            | Sponsors.jsx, SponsorsSection      |
| Dev 6     | `src/pages/Contact/`             | Contact.jsx, ContactSection        |
| Dev 7     | `src/pages/Volunteers/`          | Volunteers.jsx, VolunteerSection   |
| Dev 8     | `src/components/layout/`         | Navbar.jsx, Footer.jsx             |

### Rules for Collaboration

1. **Stay in your folder** — modify only your assigned page/section files.
2. **Don't edit shared files** unless coordinating with the team (App.jsx, main.jsx, AppRoutes.jsx).
3. **Reusable components** go in `src/components/` — discuss with team first.
4. **Assets** go in `src/assets/` in the appropriate subfolder.
5. **Pull before push** — always `git pull` before pushing changes.

## Routes

| Path          | Page       |
| ------------- | ---------- |
| `/`           | Home       |
| `/about`      | About      |
| `/events`     | Events     |
| `/gallery`    | Gallery    |
| `/sponsors`   | Sponsors   |
| `/contact`    | Contact    |
| `/volunteers` | Volunteers |

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Lint with ESLint
```
=======
# IEEE_WIE_CODE_2026
>>>>>>> a70b16c2f426b5c3f4b00ccceb39d9eaed1bbc21
