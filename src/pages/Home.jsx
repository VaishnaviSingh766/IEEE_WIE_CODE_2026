import React, { useState, useEffect } from "react";
import Gallery from "../components/GallerySection";
import Hero from "../components/Hero";
import Timeline from "../components/TimelineSection";
import Prizing from "../components/Prizing";
import Timer from "../components/Timer";
import CompanyCardsDemo from "../components/Sponsors";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import DomainsSection from "../components/DomainsSection";
import RulesAndRegulations from "../components/RulesAndRegulations";
import { ArrowUp } from "lucide-react";
import ThemeReveal from "../components/ThemeReveal";
import Separator from "../utils/Separator";
const MoveToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      onClick={handleClick}
      aria-label="Move to top"
      className={`fixed bottom-4 right-4 z-[100] transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      style={{
        background: "transparent",
        border: "none",
        padding: 0,
      }}
    >
      <div
        className="flex items-center justify-center w-[50px] h-[50px] rounded-full border-2 border-[#C21891] bg-white/10 hover:bg-[#FF5BCB] hover:scale-110 transition-all duration-300"
        style={{ position: "relative" }}
      >
        <ArrowUp
          size={28}
          strokeWidth={3}
          className="text-[#C21891] hover:text-black"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-60%)",
          }}
        />
      </div>
    </button>
  );
};


const Home = ({ onHeroReady }) => {
  return (
    <div className="bg-black">
      <Hero onReady={onHeroReady} />
      <ThemeReveal />
       <Separator />
      <Timer />
       <Separator />
      <DomainsSection />
       <Separator />
      <Prizing />
       <Separator />
      <RulesAndRegulations />
       <Separator />
      <Gallery />
       <Separator />
      <Timeline />
       <Separator />
      {/* <CompanyCardsDemo />
       <Separator /> */}

      <FAQ />
      <MoveToTopButton />
    </div>
  );
};

export default Home;
