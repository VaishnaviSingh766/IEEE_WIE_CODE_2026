import React, { createContext, useContext, useRef, useState } from "react";
import templateUrl from "../assets/abstract/WIE_ABSTRACT template 2k26.docx";

const RegistrationContext = createContext(null);

export const MIN_MEMBERS = 2;
export const MAX_MEMBERS = 4;
export const MAX_FILE = 2 * 1024 * 1024; // 2 MB
export const TEMPLATE_URL = templateUrl;

export const DOMAINS = [
    "Open Innovation",
    "HealthCare",
    "Smart Education",
    "Environment and Sustainability",
    "Women Empowerment",
    "Smart City and Urban Innovation",
    "Agriculture and Food Technology",
    "Social and Community Development",
];

export const YEARS = ["1st year", "2nd year", "3rd year", "4th year"];
export const GENDERS = ["Female", "Male"];
export const SIZES = ["2", "3", "4"];

const MEMBER_FIELDS = ["name", "usn", "email", "year", "gender"];
const DEFAULT_MSG = {
    name: "Enter the full name.",
    usn: "Enter a valid USN.",
    email: "Enter a valid email address.",
    year: "Choose the year.",
    gender: "Choose the gender.",
};

// Team rules:
//   2 members -> both female
//   3 members -> at least 1 female (leader)
//   4 members -> at least 2 female
export const requiredGirls = (n) => (n === 3 ? 1 : 2);
export const isLocked = (i, n) => i === 0 || (n === 2 && i === 1);

export const blankMember = (i) => ({
    name: "",
    usn: "",
    email: "",
    year: "",
    gender: i === 0 ? "Female" : "",
});

export const fitMembers = (list, n) =>
    Array.from({ length: n }, (_, i) => list[i] || blankMember(i));

export const applyLocks = (list) =>
    list.map((m, i) => (isLocked(i, list.length) ? { ...m, gender: "Female" } : m));

function fieldOk(k, v) {
    if (k === "name") return v.length >= 2;
    if (k === "usn") return /^[A-Za-z0-9]{5,15}$/.test(v);
    if (k === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    return v !== "";
}

function memberErrors(i, members) {
    const out = {};
    MEMBER_FIELDS.forEach((k) => {
        const v = (members[i]?.[k] || "").trim();
        let ok = fieldOk(k, v);
        let msg = DEFAULT_MSG[k];
        if (ok && (k === "usn" || k === "email")) {
            const dup = members.some(
                (o, j) => j !== i && (o[k] || "").trim().toLowerCase() === v.toLowerCase()
            );
            if (dup) {
                ok = false;
                msg =
                    k === "usn"
                        ? "This USN is already used in the team."
                        : "This email is already used in the team.";
            }
        }
        if (!ok) out[k] = msg;
    });
    return out;
}

function teamErrors(t) {
    const e = {};
    if (!t.team || t.team.trim().length < 2) e.team = "Enter a team name.";
    if (!t.college || t.college.trim().length < 3) e.college = "Enter your college name.";
    if (!t.domain) e.domain = "Choose a domain.";
    if (!t.size) e.size = "Choose your team size.";
    return e;
}

export function RegistrationProvider({ children, apiUrl = import.meta.env?.VITE_API_URL || "http://localhost:3000" }) {
    const [step, setStep] = useState(1);
    const [team, setTeam] = useState({ team: "", college: "", domain: "", size: "" });
    const [members, setMembers] = useState(fitMembers([], MIN_MEMBERS));
    const [cur, setCur] = useState(0);
    const [errs, setErrs] = useState({});
    const [groupErr, setGroupErr] = useState("");
    const [abstract, setAbstract] = useState(null);
    const [absErr, setAbsErr] = useState("");
    const [referralCode, setReferralCode] = useState("");
    const [busy, setBusy] = useState(false);
    const [submitErr, setSubmitErr] = useState("");
    const [done, setDone] = useState(null);

    const rootRef = useRef(null);
    const groupRef = useRef(null);
    const fileRef = useRef(null);

    const focusInvalid = () =>
        setTimeout(
            () => rootRef.current?.querySelector('[aria-invalid="true"]')?.focus(),
            0
        );

    const focusFirst = () =>
        setTimeout(
            () =>
                rootRef.current
                    ?.querySelector(
                        ".reg-body input:not([type=file]):not(:disabled), .reg-body .reg-dd-b:not(:disabled)"
                    )
                    ?.focus(),
            40
        );

    // Team updates
    const setT = (k, v) => {
        setTeam((t) => ({ ...t, [k]: v }));
        if (errs[k]) setErrs((e) => ({ ...e, [k]: "" }));
    };

    const checkT = (k) =>
        setErrs((p) => ({ ...p, [k]: teamErrors(team)[k] || "" }));

    // Member updates
    const setM = (i, k, v) => {
        setMembers((ms) => ms.map((m, j) => (j === i ? { ...m, [k]: v } : m)));
        if (errs[`${i}-${k}`]) setErrs((e) => ({ ...e, [`${i}-${k}`]: "" }));
        setGroupErr("");
    };

    const checkM = (i, k) =>
        setErrs((p) => ({ ...p, [`${i}-${k}`]: memberErrors(i, members)[k] || "" }));

    // Step transitions
    const next1 = () => {
        const e = teamErrors(team);
        setErrs((p) => ({ ...p, team: "", college: "", domain: "", size: "", ...e }));
        if (Object.keys(e).length) return focusInvalid();
        setMembers((ms) => applyLocks(fitMembers(ms, Number(team.size))));
        setCur(0);
        setStep(2);
        focusFirst();
    };

    const next2 = () => {
        const e = memberErrors(cur, members);
        setErrs((p) => {
            const n = { ...p };
            MEMBER_FIELDS.forEach((k) => (n[`${cur}-${k}`] = e[k] || ""));
            return n;
        });
        if (Object.keys(e).length) return focusInvalid();
        if (cur < members.length - 1) {
            setCur(cur + 1);
            focusFirst();
            return;
        }
        const girls = members.filter((m) => m.gender === "Female").length;
        const need = requiredGirls(members.length);
        if (girls < need) {
            setGroupErr(`Your team needs at least ${need} female participant(s).`);
            setTimeout(() => groupRef.current?.focus(), 0);
            return;
        }
        setStep(3);
    };

    const back2 = () => {
        setGroupErr("");
        if (cur > 0) {
            setCur(cur - 1);
            focusFirst();
        } else {
            setStep(1);
            focusFirst();
        }
    };

    // File handling
    const clearFile = () => {
        setAbstract(null);
        if (fileRef.current) fileRef.current.value = "";
    };

    const onFile = (e) => {
        const f = e.target.files?.[0];
        if (!f) return clearFile();
        const isPdf = f.type === "application/pdf" || /\.pdf$/i.test(f.name);
        if (!isPdf) {
            clearFile();
            return setAbsErr("Only PDF files are accepted.");
        }
        if (f.size > MAX_FILE) {
            clearFile();
            return setAbsErr("The file is larger than 2 MB.");
        }
        setAbstract(f);
        setAbsErr("");
    };

    // API Submission (Backend sync)
    const submitRegistration = async (e) => {
        if (e) e.preventDefault();
        if (step === 1) return next1();
        if (step === 2) return next2();
        if (!abstract) return setAbsErr("Upload your abstract as a PDF.");

        setBusy(true);
        setSubmitErr("");

        try {
            const cleanRefCode = referralCode.trim().toUpperCase();

            const formData = new FormData();
            formData.append(
                "team",
                JSON.stringify({
                    name: team.team.trim(),
                    college: team.college.trim(),
                    domain: team.domain,
                    size: members.length,
                    referralCode: cleanRefCode,
                })
            );
            formData.append(
                "members",
                JSON.stringify(
                    members.map((m) => ({
                        name: m.name.trim(),
                        usn: m.usn.trim(),
                        email: m.email.trim(),
                        year: m.year,
                        gender: m.gender,
                    }))
                )
            );
            formData.append("abstract", abstract);
            formData.append("referralCode", cleanRefCode);

            const response = await fetch(`${apiUrl}/api/register`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                const errorText =
                    data.error ||
                    (data.errors && data.errors.join(". ")) ||
                    "Submission failed. Please check your data.";
                throw new Error(errorText);
            }

            // No Drive links sent to frontend
            setDone({
                team,
                members,
                referralCode: cleanRefCode,
                fileName: data.abstract?.fileName || abstract.name,
                rowNumber: data.rowNumber,
            });
        } catch (err) {
            console.error("Submission error:", err);
            setSubmitErr(err.message || "We couldn't submit your registration. Please try again.");
        } finally {
            setBusy(false);
        }
    };

    const resetForm = () => {
        setTeam({ team: "", college: "", domain: "", size: "" });
        setMembers(fitMembers([], MIN_MEMBERS));
        setErrs({});
        setGroupErr("");
        clearFile();
        setAbsErr("");
        setReferralCode("");
        setSubmitErr("");
        setCur(0);
        setStep(1);
        setDone(null);
    };

    const value = {
        step,
        setStep,
        team,
        setT,
        checkT,
        members,
        setM,
        checkM,
        cur,
        setCur,
        errs,
        groupErr,
        abstract,
        absErr,
        referralCode,
        setReferralCode,
        onFile,
        clearFile,
        busy,
        submitErr,
        done,
        next1,
        next2,
        back2,
        submitRegistration,
        resetForm,
        rootRef,
        groupRef,
        fileRef,
    };

    return (
        <RegistrationContext.Provider value={value}>
            {children}
        </RegistrationContext.Provider>
    );
}

export function useRegistration() {
    const ctx = useContext(RegistrationContext);
    if (!ctx) {
        throw new Error("useRegistration must be used within a RegistrationProvider");
    }
    return ctx;
}