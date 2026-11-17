
import React, { useEffect, useState, memo } from "react";
import "../cssfiles/Timer.css";
import Background from "../utils/Background";

const StableBackground = memo(Background);

const DOT_COUNT = 40;

const getActiveDotCount = (label, value) => {
  const maxValues = {
    DAYS: 30,
    HOURS: 24,
    MINUTES: 60,
    SECONDS: 60,
  };

  const maxValue = maxValues[label] ?? 60;
  const safeValue = Math.min(Math.max(value, 0), maxValue);

  return Math.round((safeValue / maxValue) * DOT_COUNT);
};

const TimerUnit = ({ label, value }) => {
  const activeDots = getActiveDotCount(label, value);

  const dots = Array.from({ length: DOT_COUNT }, (_, index) => ({
    key: `${label}-${index}`,
    active: index < activeDots,
    angle: `${(360 / DOT_COUNT) * index}deg`,
  }));

  return (
    <div className="timer-unit">
      <div className="timer-ring">
        <div className="timer-dots" aria-hidden="true">
          {dots.map(({ key, active, angle }) => (
            <span
              key={key}
              className={`timer-dot ${active ? "active" : "inactive"}`}
              style={{ "--angle": angle }}
            />
          ))}
        </div>

        <span
          key={`${label}-${value}`}
          className="timer-value font-time"
        >
          {String(value).padStart(2, "0")}
        </span>
      </div>

      <div className="timer-label font-paragraph">{label}</div>
    </div>
  );
};

const Timer = () => {
  const targetDate = new Date("2026-11-28T08:00:00+05:30").getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateTimer = () => {
      const remaining = Math.max(0, targetDate - Date.now());

      setTimeLeft({
        days: Math.floor(remaining / 86400000),
        hours: Math.floor((remaining % 86400000) / 3600000),
        minutes: Math.floor((remaining % 3600000) / 60000),
        seconds: Math.floor((remaining % 60000) / 1000),
      });
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MINUTES", value: timeLeft.minutes },
    { label: "SECONDS", value: timeLeft.seconds },
  ];

  return (
    <section className="timer-page">
      <div className="timer-background">
        <StableBackground />
      </div>

      <div className="timer-content">
        <h2 className="font-heading m-0 mb-[26px] border-0 p-0 text-center text-[clamp(25px,3.6vw,46px)] font-extrabold tracking-normal leading-[1.2] text-white">
          COUNTDOWN
        </h2>

        <div className="timer-units">
          {units.map(({ label, value }) => (
            <TimerUnit key={label} label={label} value={value} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timer;
