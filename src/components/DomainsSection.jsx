import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import DomainCard from "./DomainCard";
import { useExitNavigation } from "./DomainDescriptionPage";
import Background from "../utils/Background";
/**
 * Single source of truth for all hackathon domains.
 *
 * Palette:
 * Black   #000000
 * Magenta #C21891
 * White   #FFFFFF
 */

export const domains = [
  {
    id: "open",
    title: "Open Innovation",
    description:
      "Unleash creativity through groundbreaking interdisciplinary solutions that challenge conventional approaches.",
    fullDescription:
      "Participants are encouraged to think beyond traditional frameworks and develop innovative solutions that combine multiple disciplines such as artificial intelligence, robotics, renewable energy, and emerging technologies.",
    example:
      "A crowdsourced disaster-management platform using AI to predict high-risk areas and help authorities plan evacuations.",
  },

  {
    id: "health",
    title: "HealthCare",
    description:
      "Reimagine healthcare through intelligent technology, better accessibility, and patient-centered innovation.",
    fullDescription:
      "Develop solutions that improve patient care, hospital processes, health monitoring, medical accessibility, diagnostics, and overall healthcare delivery using technologies such as AI, data analytics, and smart devices.",
    example:
      "An AI-powered platform that analyzes medical images to assist in early cancer detection.",
  },

  {
    id: "education",
    title: "Smart Education",
    description:
      "Transform learning through accessible, personalized, inclusive, and engaging technology.",
    fullDescription:
      "Create innovative educational experiences that improve accessibility, personalize learning, empower teachers, and make education more interactive and inclusive.",
    example:
      "An immersive learning platform that provides virtual historical tours for students.",
  },

  {
    id: "environment",
    title: "Environment & Sustainability",
    description:
      "Build sustainable solutions that protect resources and create a cleaner future.",
    fullDescription:
      "Develop solutions focused on renewable energy, waste reduction, climate mitigation, sustainable consumption, eco-friendly products, and responsible resource management.",
    example:
      "A gamified recycling platform that encourages users to properly segregate and recycle waste.",
  },

  {
    id: "women",
    title: "Women Empowerment",
    description:
      "Create technology that improves safety, opportunity, independence, and equality for women.",
    fullDescription:
      "Develop solutions that support women's safety, education, career growth, health and wellness, financial independence, entrepreneurship, and equal opportunities.",
    example:
      "A platform connecting women entrepreneurs with funding opportunities, mentors, and professional networks.",
  },

  {
    id: "city",
    title: "Smart City & Urban Innovation",
    description:
      "Reimagine cities through intelligent infrastructure, connected systems, and data-driven innovation.",
    fullDescription:
      "Develop technology-driven solutions for transportation, energy, public safety, urban planning, waste management, and other challenges faced by modern cities using IoT, AI, and big data.",
    example:
      "An IoT-powered smart parking system that detects available parking spaces in real time.",
  },

  {
    id: "agri",
    title: "Agriculture & Food Technology",
    description:
      "Use technology to create smarter, more sustainable, and productive food systems.",
    fullDescription:
      "Develop solutions that improve farming, food production, distribution, sustainability, resource efficiency, food security, and agricultural productivity.",
    example:
      "An AI-powered irrigation system that uses soil and weather data to optimize water usage.",
  },

  {
    id: "social",
    title: "Social & Community Development",
    description:
      "Use technology to create inclusive communities and meaningful social impact.",
    fullDescription:
      "Build solutions that support public welfare, accessibility, volunteering, inclusivity, community participation, and grassroots social development.",
    example:
      "A platform that connects volunteers with NGOs based on their skills and availability.",
  },
];

const formatNumber = (index) =>
  String(index + 1).padStart(2, "0");

const styles = `
  @keyframes dm-rise {
    from {
      opacity: 0;
      transform: translateY(28px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes dm-line {
    from {
      transform: scaleX(0);
    }

    to {
      transform: scaleX(1);
    }
  }

  @keyframes dm-drift {
    0%,
    100% {
      transform: translate3d(0, 0, 0);
    }

    50% {
      transform: translate3d(28px, -18px, 0);
    }
  }

  @keyframes dm-pulse {
    0%,
    100% {
      opacity: 0.55;
    }

    50% {
      opacity: 1;
    }
  }

  .dm-reveal {
    opacity: 0;
  }

  .dm-reveal--in {
    animation:
      dm-rise
      900ms
      cubic-bezier(0.22, 1, 0.36, 1)
      both;
  }

  .dm-head-line {
    transform-origin: left;
    animation:
      dm-line
      1100ms
      cubic-bezier(0.22, 1, 0.36, 1)
      150ms
      both;
  }

  .dm-drift {
    animation:
      dm-drift
      20s
      ease-in-out
      infinite;
  }

  .dm-pulse {
    animation:
      dm-pulse
      4s
      ease-in-out
      infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .dm-reveal {
      opacity: 1;
    }

    .dm-reveal--in,
    .dm-head-line,
    .dm-drift,
    .dm-pulse {
      animation: none;
    }
  }
`;
export default function DomainsSection() {
  const gridRef = useRef(null);

  const { hash } = useLocation();

  /* Same curtain flow as the "Back to Domains" button on the domain page. */
  const goTo = useExitNavigation();

  /*
   * Arriving from a domain page (/#domains): the cards must already be
   * on screen, so skip the reveal animation entirely (no "render from zero").
   */
  const [skipReveal] = useState(hash === "#domains");

  const [visible, setVisible] = useState(hash === "#domains");

  /* Reveal cards when the section enters the viewport. */
  useEffect(() => {
    const node = gridRef.current;

    if (!node) {
      setVisible(true);
      return undefined;
    }

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0,
        rootMargin: "0px 0px 120px 0px",
      }
    );

    observer.observe(node);

    const timer = setTimeout(() => {
      setVisible(true);
    }, 400);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  /* Returning from /domains/open to /#domains: jump straight to the section. */
  useEffect(() => {
    if (hash !== "#domains") return undefined;

    setVisible(true);

    const frame = requestAnimationFrame(() => {
      document.getElementById("domains")?.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [hash]);

  /* Opening a domain -> same closing/opening curtain as the Back button. */
  const handleOpen = (domain, index, event) => {
    goTo(
      `/domains/${domain.id}`,
      `Domain ${formatNumber(index)} / ${formatNumber(domains.length)}`
    )(event);
  };

  return (
    <section
      id="domains"
      aria-labelledby="domains-heading"
      className="
      relative
      isolate
      w-full
      overflow-hidden
      bg-black
      px-5
      py-12
      text-white
      sm:px-8
      sm:py-16
      lg:px-12
    "
    >
      <Background
        density={0.9}
        colors={["#ffffff", "#FF4DB8", "#E6007E"]}
        speed={1}
        fixed={false}
      />

      <style>{styles}</style>

      {/* Background */}
      <div
        aria-hidden="true"
        className="
        pointer-events-none
        absolute
        inset-0
        -z-10
      "
      >
        {/* Top line */}
       
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">

        {/* Introduction */}
        

<header className="mb-8 sm:mb-12">
  <h2
    id="domains-heading"
    className="
      w-full
      text-center
      break-words
      text-[clamp(3rem,11vw,7.5rem)]
      font-heading
      leading-[0.9]
      tracking-tight
      text-white
    "
  >
    Domains
  </h2>
</header>



        {/* Domain Cards (routes unchanged: /domains/:id) */}
        <ul
          ref={gridRef}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-12"
        >
          {domains.map((domain, index) => (
            <li
              key={domain.id}
              className={
                skipReveal
                  ? index >= domains.length - 2
                    ? "lg:relative lg:left-[calc(50%_+_0.75rem)]"
                    : ""
                  : `
                dm-reveal
                ${visible ? "dm-reveal--in" : ""}
                ${
                  index >= domains.length - 2
                    ? "lg:relative lg:left-[calc(50%_+_0.75rem)]"
                    : ""
                }
              `
              }
              style={
                skipReveal
                  ? undefined
                  : {
                    animationDelay: `${index * 100}ms`,
                  }
              }
            >
              <DomainCard
                id={domain.id}
                title={domain.title}
                onSelect={(id, event) => handleOpen(domain, index, event)}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}