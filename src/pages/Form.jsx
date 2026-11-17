import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../cssfiles/Form.css";
import "../cssfiles/font.css";
import Divider from "../utils/Separator";
import Button from "../utils/Button";
import Loader from "../components/Loader";
import {
  useRegistration,
  DOMAINS,
  YEARS,
  GENDERS,
  SIZES,
  TEMPLATE_URL,
  isLocked,
} from "../context/RegistrationContext.jsx";

/* ---------- UI Components ---------- */
function Field({ id, label, error, hint, children }) {
  return (
    <div className={`reg-f${error ? " bad" : ""}`}>
      <label id={`${id}-label`} htmlFor={id}>
        {label}
      </label>
      {children}
      {hint}
      {error && (
        <span className="reg-err" id={`${id}-err`}>
          {error}
        </span>
      )}
    </div>
  );
}

function Dropdown({ id, value, options, placeholder, onChange, disabled, error }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const away = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  }, [open]);

  useEffect(() => {
    if (open) {
      const i = options.indexOf(value);
      setActive(i >= 0 ? i : 0);
    }
  }, [open, options, value]);

  useEffect(() => {
    const list = listRef.current;
    const el = list?.children[active];
    if (!open || !list || !el) return;
    const top = el.offsetTop;
    const bottom = top + el.offsetHeight;
    if (top < list.scrollTop) list.scrollTop = top - 8;
    else if (bottom > list.scrollTop + list.clientHeight)
      list.scrollTop = bottom - list.clientHeight + 8;
  }, [active, open]);

  const choose = (o) => {
    onChange(o);
    setOpen(false);
  };

  const onKey = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return setOpen(true);
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((a) => (a + step + options.length) % options.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!open) setOpen(true);
      else choose(options[active]);
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "Tab" && open) {
      setOpen(false);
    }
  };

  return (
    <div
      ref={wrapRef}
      className={`reg-dd${open ? " open" : ""}${value ? " has" : ""}`}
    >
      <button
        type="button"
        id={id}
        className="reg-dd-b"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-labelledby={`${id}-label`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${id}-err` : undefined}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKey}
      >
        <span className="reg-dd-t">{value || placeholder}</span>
      </button>
      <ul
        id={`${id}-list`}
        ref={listRef}
        className="reg-dd-l"
        role="listbox"
        aria-labelledby={`${id}-label`}
      >
        {options.map((o, i) => (
          <li
            key={o}
            role="option"
            aria-selected={o === value}
            className={i === active ? "act" : undefined}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => choose(o)}
          >
            {o}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Main Registration Form Component ---------- */
export default function Registration() {
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);
  const {
    step,
    setStep,
    team,
    setT,
    checkT,
    members,
    setM,
    checkM,
    cur,
    errs,
    groupErr,
    abstract,
    absErr,
    onFile,
    referralCode,
    setReferralCode,
    busy,
    submitErr,
    done,
    next1,
    next2,
    back2,
    submitRegistration,
    rootRef,
    groupRef,
    fileRef,
  } = useRegistration();

  const m = members[cur] || { name: "", usn: "", email: "", year: "", gender: "" };
  const isLeader = cur === 0;
  const locked = isLocked(cur, members.length);
  const k = (f) => `${cur}-${f}`;

  useEffect(() => {
    if (!done) return;
    let navigationTimer;
    const timer = setTimeout(() => {
      setRedirecting(true);
      navigationTimer = setTimeout(() => navigate("/"), 2000);
    }, 3000);
    return () => {
      clearTimeout(timer);
      clearTimeout(navigationTimer);
    };
  }, [done, navigate]);

  return (
    <div className="reg font-paragraph" ref={rootRef}>
      {redirecting && (
        <div className="reg-submit-overlay" role="status" aria-label="Loading">
          <Loader />
        </div>
      )}
      {busy && (
        <div className="reg-submit-overlay" role="status" aria-live="polite">
          <div className="reg-submit-loader" aria-hidden="true" />
          <span className="font-subheading">Submitting</span>
        </div>
      )}
      <div className="reg-bg" aria-hidden="true">
        <span className="reg-sw a" />
        <span className="reg-sw b" />
        <span className="reg-sw c" />
      </div>

      <main className="reg-main">
        <div className="reg-ttl">
          <h1 className="font-heading">Registrations</h1>
          <Divider />
          <p className="font-paragraph">IEEE WIE · SIT Student Branch</p>
        </div>

        <div className={`reg-card${done ? " fin" : ""}`}>
          {!done && (
            <div className="reg-prog">
              <div className="reg-pg">
                {["Your team", "Members", "Abstract"].map((label, i) => (
                  <i
                    key={label}
                    data-n={i + 1}
                    data-l={label}
                    className={`font-numbers ${i + 1 === step ? "on" : i + 1 < step ? "ok" : ""}`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="reg-body">
            {done ? (
              <div className="reg-done" role="status" aria-live="polite">
                <div className="reg-okic" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  </svg>
                </div>
                <h2 className="font-subheading">Team registered!</h2>
                <p className="font-paragraph">Thank you for your submission! Your response has been recorded successfully.</p>
              </div>
            ) : (
              <form onSubmit={submitRegistration} noValidate>
                {/* STEP 1: TEAM DETAILS */}
                {step === 1 && (
                  <div className="reg-step">
                    <div className="reg-tpl">
                      <div>
                        <b className="font-subheading">Abstract Template</b>
                      </div>
                      <Button
                        className="reg-pick font-subheading"
                        href={TEMPLATE_URL}
                        download="WIE_ABSTRACT template 2k26.docx"
                      >
                        Download
                      </Button>
                    </div>

                    <div className="reg-sh">
                      <h2 className="font-subheading">Your team</h2>
                      <p className="font-paragraph">Tell us about your team.</p>
                    </div>
                    <div className="reg-g2">
                      <Field id="team" label="Team name" error={errs.team}>
                        <input
                          id="team"
                          autoComplete="off"
                          placeholder="Enter your team name"
                          value={team.team}
                          onChange={(e) => setT("team", e.target.value)}
                          onBlur={() => checkT("team")}
                          aria-invalid={errs.team ? "true" : "false"}
                          aria-describedby={errs.team ? "team-err" : undefined}
                        />
                      </Field>
                      <Field id="college" label="College name" error={errs.college}>
                        <input
                          id="college"
                          autoComplete="off"
                          placeholder="Enter your college name"
                          value={team.college}
                          onChange={(e) => setT("college", e.target.value)}
                          onBlur={() => checkT("college")}
                          aria-invalid={errs.college ? "true" : "false"}
                          aria-describedby={errs.college ? "college-err" : undefined}
                        />
                      </Field>
                      <Field id="domain" label="Domain" error={errs.domain}>
                        <Dropdown
                          id="domain"
                          value={team.domain}
                          options={DOMAINS}
                          placeholder="Select a domain"
                          onChange={(v) => setT("domain", v)}
                          error={errs.domain}
                        />
                      </Field>
                      <Field id="size" label="Team size" error={errs.size}>
                        <Dropdown
                          id="size"
                          value={team.size}
                          options={SIZES}
                          placeholder="Select team size"
                          onChange={(v) => setT("size", v)}
                          error={errs.size}
                        />
                      </Field>
                    </div>
                    <div className="reg-one">
                      <Button className="font-subheading" onClick={next1}>
                        Next
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 2: MEMBER DETAILS */}
                {step === 2 && (
                  <div className="reg-step">
                    <div className="reg-sh">
                      <h2 className="font-subheading">Members</h2>
                      <p className="font-paragraph">Fill in the details of each participant.</p>
                    </div>

                    <div className="reg-member" key={cur}>
                      <h3 className="reg-dh font-subheading">
                        <span>Participant {cur + 1}</span>
                        {isLeader && <small>(Team leader)</small>}
                      </h3>
                      <div className="reg-g2">
                        <Field id={`m${cur}-name`} label="Full name" error={errs[k("name")]}>
                          <input
                            id={`m${cur}-name`}
                            autoComplete="off"
                            placeholder="Full name"
                            value={m.name}
                            onChange={(e) => setM(cur, "name", e.target.value)}
                            onBlur={() => checkM(cur, "name")}
                            aria-invalid={errs[k("name")] ? "true" : "false"}
                            aria-describedby={errs[k("name")] ? `m${cur}-name-err` : undefined}
                          />
                        </Field>
                        <Field id={`m${cur}-usn`} label="USN" error={errs[k("usn")]}>
                          <input
                            id={`m${cur}-usn`}
                            autoComplete="off"
                            placeholder="USN"
                            value={m.usn}
                            onChange={(e) => setM(cur, "usn", e.target.value)}
                            onBlur={() => checkM(cur, "usn")}
                            aria-invalid={errs[k("usn")] ? "true" : "false"}
                            aria-describedby={errs[k("usn")] ? `m${cur}-usn-err` : undefined}
                          />
                        </Field>
                        <Field id={`m${cur}-email`} label="Email" error={errs[k("email")]}>
                          <input
                            id={`m${cur}-email`}
                            type="email"
                            autoComplete="off"
                            placeholder="name@example.com"
                            value={m.email}
                            onChange={(e) => setM(cur, "email", e.target.value)}
                            onBlur={() => checkM(cur, "email")}
                            aria-invalid={errs[k("email")] ? "true" : "false"}
                            aria-describedby={errs[k("email")] ? `m${cur}-email-err` : undefined}
                          />
                        </Field>
                        <Field id={`m${cur}-year`} label="Year" error={errs[k("year")]}>
                          <Dropdown
                            id={`m${cur}-year`}
                            value={m.year}
                            options={YEARS}
                            placeholder="Select year"
                            onChange={(v) => setM(cur, "year", v)}
                            error={errs[k("year")]}
                          />
                        </Field>
                        <Field
                          id={`m${cur}-gender`}
                          label="Gender"
                          error={errs[k("gender")]}
                          hint={
                            locked ? (
                              <span className="reg-hint">
                                {isLeader
                                  ? "The team leader must be female."
                                  : "Both members of a team of 2 must be female."}
                              </span>
                            ) : null
                          }
                        >
                          <Dropdown
                            id={`m${cur}-gender`}
                            value={m.gender}
                            options={GENDERS}
                            placeholder="Select gender"
                            disabled={locked}
                            onChange={(v) => setM(cur, "gender", v)}
                            error={errs[k("gender")]}
                          />
                        </Field>
                      </div>
                    </div>

                    {groupErr && (
                      <div className="reg-group-err" role="alert" tabIndex={-1} ref={groupRef}>
                        {groupErr}
                      </div>
                    )}

                    <div className="reg-nav">
                      <Button className="font-subheading" onClick={back2}>
                        Back
                      </Button>
                      <Button className="font-subheading" onClick={next2}>
                        {cur < members.length - 1 ? "Next" : "Next: Abstract"}
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 3: ABSTRACT UPLOAD & REFERRAL */}
                {step === 3 && (
                  <div className="reg-step">
                    <div className="reg-sh">
                      <h2 className="font-subheading">Abstract</h2>
                      <p className="font-paragraph">Share a short summary of your project idea as a PDF.</p>
                    </div>

                    <div className="reg-tpl">
                      <div>
                        <b className="font-subheading">Abstract template</b>
                        <small>Download the template, fill it in, then upload it below as a PDF.</small>
                      </div>
                      <Button
                        className="reg-pick font-subheading"
                        href={TEMPLATE_URL}
                        download="WIE_ABSTRACT template 2k26.docx"
                      >
                        Download
                      </Button>
                    </div>

                    <div className={`reg-f${absErr ? " bad" : ""}`}>
                      <div className="reg-drop">
                        <div>
                          <b className="font-subheading">
                            {abstract ? "Abstract uploaded" : "Upload your abstract"}
                          </b>
                          <small>{abstract ? abstract.name : "PDF only, up to 2 MB"}</small>
                        </div>
                        <Button
                          className="font-subheading"
                          onClick={() => fileRef.current?.click()}
                        >
                          {abstract ? "Choose another" : "Choose file"}
                        </Button>
                        <input
                          ref={fileRef}
                          type="file"
                          accept="application/pdf,.pdf"
                          aria-label="Project abstract"
                          aria-invalid={absErr ? "true" : "false"}
                          onChange={onFile}
                        />
                      </div>
                      {absErr && <span className="reg-err">{absErr}</span>}
                    </div>

                    {/* REFERRAL CODE (OPTIONAL) - Placed directly above submit button */}
                    <div className="reg-referral-section">
                      <Field id="referralCode" label="Referral code (Optional)">
                        <input
                          id="referralCode"
                          autoComplete="off"
                          placeholder="Enter referral code if you have one"
                          value={referralCode}
                          onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                        />
                      </Field>
                    </div>

                    {submitErr && (
                      <div className="reg-group-err" role="alert">
                        {submitErr}
                      </div>
                    )}

                    <div className="reg-nav">
                      <Button className="font-subheading" onClick={() => setStep(2)}>
                        Back
                      </Button>
                      <Button className="font-subheading" type="submit" disabled={busy}>
                        {busy ? "Submitting..." : "Submit registration"}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}