
import { useState, useEffect, useCallback } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import CallForVolunteer from "./pages/CallForVolunteer";
import ContactUsSection from "./pages/ContactUsSection";
import Form from "./pages/Form";
import Carousel from "./pages/Carousel";
import Footer from "./components/Footer";
import DomainDescriptionPage from "./components/DomainDescriptionPage";
import SplashCursor from "./utils/SplashCursor";
import ScrollToTop from "./components/ScrollToTop";
import Loader from "./components/Loader";

export default function App() {
  const [heroReady, setHeroReady] = useState(false);
  const [minTime, setMinTime] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setMinTime(true), 1500);

    return () => clearTimeout(timer);
  }, []);

  const onHeroReady = useCallback(() => setHeroReady(true), []);
  const hideLoader = minTime && (location.pathname !== "/" || heroReady);

  return (
    <div className="select-none">
      {showLoader && (
        <div
          className={`fixed inset-0 z-[100] grid place-items-center bg-black transition-[opacity,transform] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            hideLoader ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
          }`}
          onTransitionEnd={(event) => {
            if (event.target === event.currentTarget && hideLoader) {
              setShowLoader(false);
            }
          }}
        >
          <Loader />
        </div>
      )}

      <ScrollToTop />
      <SplashCursor trailColor="#C21891" />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home onHeroReady={onHeroReady} />} />
        <Route
          path="/domains/:domainId"
          element={<DomainDescriptionPage />}
        />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/volunteers" element={<CallForVolunteer />} />
        <Route path="/contact" element={<ContactUsSection />} />
        <Route path="/register" element={<Form />} />
        <Route path="/carousel" element={<Carousel />} />
      </Routes>

      <Footer />
    </div>
  );
}
