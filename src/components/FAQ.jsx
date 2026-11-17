import { useState, useEffect, useRef, useCallback, useId } from "react";
import { useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import '../cssfiles/font.css';

import Background from '../utils/Background'


/* FAQ DATA */

const faqData = [
  {
    id: "faq-duration",
    question: "How long is the Hackathon?",
    answer:
      "The Hackathon will last for 12 hours, from 28th November 2026, 9:00 AM to 8:00 PM.",
  },
  {
    id: "faq-registration-close",
    question: "When does registration close?",
    answer: "Online registrations will be closed on 24th November 2026.",
  },
  {
    id: "faq-team-size",
    question: "How many members can be in a team?",
    answer:
      "Teams can have 2 members (all girls team), 3 members (minimum 1 girl), or 4 members (minimum 2 girls).",
  },
  {
    id: "faq-documents",
    question: "What documents are needed at registration?",
    answer:
      "Each member should provide their details at the time of registration. An abstract in PDF format must also be submitted as per the specified format.",
  },
  {
    id: "faq-multiple-solutions",
    question: "Can teams submit multiple solutions?",
    answer:
      "Yes, teams may submit solutions to multiple problems, but if selected, only one best solution will be considered.",
  },
  {
    id: "faq-mentors",
    question: "Will teams get mentors?",
    answer:
      "Yes, a mentor from renowned industries will be allotted to each team to guide them during the competition.",
  },
  {
    id: "faq-evaluation",
    question: "How will progress be evaluated?",
    answer:
      "Teams must present ideas to mentors at 3 checkpoints. Progress will be evaluated based on judging criteria.",
  },
];

/* FAQ STYLES */

const faqStyles = `
/* Reduced-motion accessibility */

@media (prefers-reduced-motion: reduce) {
  .faq-section *,
  .faq-section *::before,
  .faq-section *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Section entrance */

@keyframes faqFadeInUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.faq-section {
  background: #000000;
  padding: 100px 24px 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.faq-section--visible {
  animation: faqFadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* Container */

.faq__container {
  position: relative;
  width: 100%;
  max-width: 660px;
}

/* Ambient background */

.faq__ambient {
  position: absolute;
  inset: 220px -80px -40px -80px;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(
      360px 260px at 12% 18%,
      rgba(255, 255, 255, 0.04),
      transparent 70%
    ),
    radial-gradient(
      420px 300px at 92% 55%,
      rgba(255, 255, 255, 0.03),
      transparent 70%
    ),
    radial-gradient(
      360px 260px at 25% 92%,
      rgba(255, 255, 255, 0.025),
      transparent 70%
    );
  filter: blur(24px);
}

.faq__container > *:not(.faq__ambient) {
  position: relative;
  z-index: 1;
}

/* Heading: uses your custom font-heading class */

.faq__heading {
  font-family: 'Playfair Display', 'Georgia', serif;
  font-weight: 600;
  font-size: clamp(2.5rem, 5vw, 5rem);
  line-height: 1.15;
  letter-spacing: -0.01em;
  text-align: center;
  margin: 0 0 40px;
}

.faq__heading-accent {
  color: #C21891;
  text-shadow: 0 0 20px rgba(194, 24, 145, 0.35);
}

/* Subtitle */

.faq__subtitle {
  font-family: 'Paragraph', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: #c4c4c8;
  text-align: center;
  margin: 0 0 56px;
  line-height: 1.6;
}

/* Accordion list */

.faq__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* FAQ item */

.faq__item {
  position: relative;
  filter: none;
  opacity: 1;
}

.faq__item--active {
  z-index: 3;
}

/* Glass card */

.faq__item-inner {
  position: relative;
  isolation: isolate;
  display: flex;
  width: 100%;
  flex-direction: column;
  overflow: hidden;
  padding: 0;
  margin: 0;
  border-radius: 25px;
  border: 1px solid rgba(255, 255, 255, 0.18);

  background: linear-gradient(
    160deg,
    rgba(255, 255, 255, 0.075),
    rgba(255, 255, 255, 0.03) 45%,
    rgba(255, 255, 255, 0.02)
  );

  -webkit-backdrop-filter: blur(22px) saturate(120%);
  backdrop-filter: blur(22px) saturate(120%);

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.16),
    0 20px 50px rgba(0, 0, 0, 0.35);

  transition:
    transform 0.3s,
    border-color 0.3s,
    box-shadow 0.3s;
}

/* Glass layer */

.faq__glass-layer {
  pointer-events: none;
  position: absolute;
  inset: 0;
  border-radius: inherit;

  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(220, 220, 225, 0.02) 30%,
    rgba(255, 255, 255, 0.005) 60%,
    rgba(0, 0, 0, 0.18) 100%
  );
}

/* Top-left glass highlight */

.faq__glass-corner {
  pointer-events: none;
  position: absolute;
  inset: 0;
  border-radius: inherit;

  background: radial-gradient(
    90% 120% at 0% 0%,
    rgba(215, 215, 220, 0.16) 0%,
    rgba(215, 215, 220, 0.07) 26%,
    rgba(215, 215, 220, 0.02) 46%,
    rgba(215, 215, 220, 0) 60%
  );

  opacity: 0.85;
  transition: opacity 0.3s;
}

/* Glass edge highlights */

.faq__glass-edge {
  pointer-events: none;
  position: absolute;
  inset: 0;
  border-radius: inherit;

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.10),
    inset 0 -1px 0 rgba(255, 255, 255, 0.04);
}

/* Fallback for unsupported backdrop-filter */

@supports not (
  (backdrop-filter: blur(1px)) or
  (-webkit-backdrop-filter: blur(1px))
) {
  .faq__item-inner {
    background: rgba(28, 28, 32, 0.92);
  }
}

/* Closed-card hover */

.faq__item:not(.faq__item--active) .faq__item-inner:hover {
  border-color: rgba(255, 255, 255, 0.30);
}

.faq__item:not(.faq__item--active)
  .faq__item-inner:hover
  .faq__glass-corner {
  opacity: 1;
}

.faq__item:not(.faq__item--active)
  .faq__item-inner:hover
  .faq__arrow {
  color: #ffffff;
}

/* Active card */

.faq__item--active .faq__item-inner,
.faq__item--active .faq__item-inner:hover {
  border-color: rgba(255, 255, 255, 0.38);

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.16),
    0 20px 50px rgba(0, 0, 0, 0.35),
    0 0 20px rgba(255, 255, 255, 0.06);
}

.faq__item--active .faq__glass-corner {
  opacity: 1;
}

/* Question button */

.faq__question {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 44px;
  padding: 22px 28px;
  gap: 16px;
  font-family: "Paragraph", sans-serif !important;
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1.5;
  text-align: left;

  color: #ffffff;
  background: transparent;
  border: none;
  cursor: pointer;
  outline: none;

  transition: color 350ms ease-in-out;
}

.faq__question:hover {
  color: #ffffff;
}

.faq__item--active .faq__question {
  color: #ffffff;
}

.faq__question:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.7);
  outline-offset: -4px;
  border-radius: 25px;
}

/* Arrow */

.faq__arrow {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  color: #c4c4c8;

  transition:
    transform 350ms cubic-bezier(0.22, 1, 0.36, 1),
    color 350ms ease-in-out;
}

.faq__item--active .faq__arrow {
  transform: rotate(180deg);
  color: #ffffff;
}

/* Answer panel */

.faq__answer-wrapper {
  position: relative;
  z-index: 2;
  overflow: hidden;
  transition: height 400ms cubic-bezier(0.22, 1, 0.36, 1);
}

.faq__answer {
  margin: 0 28px;
  padding: 16px 0 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);

  font-family: 'Paragraph', sans-serif;
  font-size: 1rem !important;
  font-weight: 400;
  line-height: 1.85;
  color: #e6e6ea;

  opacity: 0;
  transition: opacity 300ms ease-in-out;
}

.faq__answer--visible {
  opacity: 1;
}

/* Responsive */

@media (max-width: 768px) {
  .faq-section {
    padding: 72px 20px 80px;
  }

  .faq__ambient {
    inset: 200px -40px -20px -40px;
  }

  .faq__heading {
    font-size: 2.25rem;
  }

  .faq__subtitle {
    font-size: 0.93rem;
    margin-bottom: 44px;
  }

  .faq__list {
    gap: 12px;
  }

  .faq__item-inner {
    border-radius: 22px;
  }

  .faq__question {
    font-size: 1.05rem;
    padding: 20px 22px;
  }

  .faq__answer {
    margin: 0 22px;
    padding: 14px 0 20px;
    font-size: 0.95rem !important;
  }
}

@media (max-width: 480px) {
  .faq-section {
    padding: 56px 16px 64px;
  }

  .faq__heading {
    font-size: 1.85rem;
  }

  .faq__subtitle {
    margin-bottom: 36px;
  }

  .faq__question {
    font-size: 1rem;
    padding: 18px;
    gap: 12px;
  }

  .faq__answer {
    margin: 0 18px;
    padding: 12px 0 18px;
    font-size: 0.9rem !important;
  }
}
`;

/* ACCORDION ITEM COMPONENT */

function FAQItem({ item, isOpen, onToggle }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  const baseId = useId();
  const questionId = `${baseId}-q-${item.id}`;
  const answerId = `${baseId}-a-${item.id}`;

  /* Measure answer height */

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  /* Update height when the window resizes */

  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      if (contentRef.current) {
        setHeight(contentRef.current.scrollHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  return (
    <li className={`faq__item${isOpen ? " faq__item--active" : ""}`}>
      <div className="faq__item-inner">
        <div className="faq__glass-layer" aria-hidden="true" />
        <div className="faq__glass-corner" aria-hidden="true" />
        <div className="faq__glass-edge" aria-hidden="true" />

        <button
          id={questionId}
          type="button"
          className="faq__question"
          onClick={() => onToggle(item.id)}
          aria-expanded={isOpen}
          aria-controls={answerId}
        >
          <span>{item.question}</span>
          <ChevronDown className="faq__arrow" aria-hidden="true" />
        </button>

        <div
          id={answerId}
          role="region"
          aria-labelledby={questionId}
          className="faq__answer-wrapper"
          style={{ height: `${height}px` }}
          aria-hidden={!isOpen}
        >
          <div ref={contentRef}>
            <p
              className={`faq__answer font-paragraph${isOpen ? " faq__answer--visible" : ""
                }`}
            >
              {item.answer}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}

/* MAIN FAQ COMPONENT */

export default function FAQ() {
  const [activeId, setActiveId] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const sectionRef = useRef(null);
  const faqListRef = useRef(null);

  const location = useLocation();
  const [previousLocationKey, setPreviousLocationKey] = useState(location.key);

  if (previousLocationKey !== location.key) {
    setPreviousLocationKey(location.key);
    setActiveId(null);
  }

  /* Section entrance animation */

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  /* Close accordion when clicking outside the FAQ list */

  useEffect(() => {
    if (activeId === null) return;

    const handleOutsideClick = (event) => {
      if (
        faqListRef.current &&
        !faqListRef.current.contains(event.target)
      ) {
        setActiveId(null);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [activeId]);

  /* Reset on browser navigation */

  useEffect(() => {
    const handleNavigation = () => {
      setActiveId(null);
    };

    window.addEventListener("hashchange", handleNavigation);
    window.addEventListener("popstate", handleNavigation);

    return () => {
      window.removeEventListener("hashchange", handleNavigation);
      window.removeEventListener("popstate", handleNavigation);
    };
  }, []);

  /* Toggle accordion */

  const handleToggle = useCallback((id) => {
    setActiveId((previousId) => (previousId === id ? null : id));
  }, []);

  return (
    <>
      <style>{faqStyles}</style>

      <section

        ref={sectionRef}
        id="faq"
        className={`faq-section${isVisible ? " faq-section--visible" : ""}`}
      >
        <Background />
        <div className="faq__container">
          <div className="faq__ambient" aria-hidden="true" />

          <h2 className="faq__heading font-heading">
            Frequently Asked Question
          </h2>

          <ul ref={faqListRef} className="faq__list">
            {faqData.map((item) => (
              <FAQItem
                key={item.id}
                item={item}
                isOpen={activeId === item.id}
                onToggle={handleToggle}
              />
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}