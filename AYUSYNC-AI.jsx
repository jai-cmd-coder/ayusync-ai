import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Leaf, Wind, Droplets, Moon, Activity, Heart, MessageCircle, Mic, MicOff,
  MapPin, Users, ChefHat, Home, User, ChevronRight, ChevronLeft, Check,
  AlertTriangle, Star, Search, Filter, Award, Flame, Volume2, Send,
  Sparkles, Sun, ShieldCheck, Globe, Plus, Clock, Phone, X, PlayCircle,
  PauseCircle, ArrowRight, Baby, UserCircle2
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar,
  CartesianGrid,
} from "recharts";

/* ------------------------------------------------------------------ */
/*  DESIGN TOKENS                                                      */
/* ------------------------------------------------------------------ */
const C = {
  base: "#FAFBF7",
  surface: "#FFFFFF",
  sage50: "#EEF4EC",
  sage200: "#CBDEC6",
  sage500: "#6E8F6A",
  sage700: "#3F5C42",
  sky100: "#E4F0F6",
  sky500: "#6FA0BE",
  clay400: "#CD8B5F",
  clay500: "#B96F42",
  gold400: "#D9A94A",
  ink900: "#212B24",
  ink600: "#54615A",
  ink400: "#8C978F",
  line: "#E3E9E0",
};

const FONTS = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Karla:wght@400;500;600;700&display=swap');
    .font-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
    .font-body { font-family: 'Karla', sans-serif; }
    @keyframes breathe-in { from { transform: scale(0.55); } to { transform: scale(1); } }
    @keyframes breathe-out { from { transform: scale(1); } to { transform: scale(0.55); } }
    @keyframes riseIn { from { opacity:0; transform: translateY(8px);} to {opacity:1; transform: translateY(0);} }
    .rise-in { animation: riseIn .5s ease both; }
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-thumb { background: ${C.sage200}; border-radius: 8px; }
    .focus-ring:focus-visible { outline: 2px solid ${C.sage700}; outline-offset: 2px; }
  `}</style>
);

/* ------------------------------------------------------------------ */
/*  MOCK DATA                                                          */
/* ------------------------------------------------------------------ */
const PROFILES = [
  { id: "self", name: "You", relation: "Primary", icon: UserCircle2 },
  { id: "amma", name: "Amma", relation: "Mother, 64", icon: UserCircle2 },
  { id: "kutty", name: "Aravind", relation: "Son, 9", icon: Baby },
];

const AYUSH_SYSTEMS = [
  { name: "Ayurveda", blurb: "Balances mind and body through diet, herbs and daily rhythm (Dinacharya).", color: C.sage500 },
  { name: "Yoga", blurb: "Postures, breath and stillness practised together for steadiness.", color: C.sky500 },
  { name: "Naturopathy", blurb: "Uses natural elements — water, sun, food — to support the body's own repair.", color: C.clay500 },
  { name: "Unani", blurb: "A Greco-Arabic tradition balancing the body's four temperaments.", color: C.gold400 },
  { name: "Siddha", blurb: "A Tamil healing system pairing herbs, minerals and lifestyle discipline.", color: C.sage700 },
  { name: "Homeopathy", blurb: "Gentle, highly diluted preparations chosen to match the whole person.", color: C.sky500 },
];

const WEEKLY_SLEEP = [
  { day: "Mon", hrs: 6.1 }, { day: "Tue", hrs: 6.6 }, { day: "Wed", hrs: 5.4 },
  { day: "Thu", hrs: 7.0 }, { day: "Fri", hrs: 6.3 }, { day: "Sat", hrs: 7.8 }, { day: "Sun", hrs: 7.2 },
];
const WEEKLY_STEPS = [
  { day: "Mon", steps: 4200 }, { day: "Tue", steps: 5600 }, { day: "Wed", steps: 3100 },
  { day: "Thu", steps: 6800 }, { day: "Fri", steps: 5200 }, { day: "Sat", steps: 8100 }, { day: "Sun", steps: 7300 },
];
const WEEKLY_STRESS = [
  { day: "Mon", level: 6 }, { day: "Tue", level: 5 }, { day: "Wed", level: 7 },
  { day: "Thu", level: 4 }, { day: "Fri", level: 5 }, { day: "Sat", level: 3 }, { day: "Sun", level: 3 },
];

const MICRO_HABITS = [
  { id: 1, title: "Warm water on waking", mins: 2, system: "Ayurveda", done: true, streak: 12 },
  { id: 2, title: "5 rounds Anulom Vilom", mins: 3, system: "Yoga", done: true, streak: 8 },
  { id: 3, title: "Oil pulling before brushing", mins: 3, system: "Ayurveda", done: false, streak: 4 },
  { id: 4, title: "Bare feet on grass, 2 min", mins: 2, system: "Naturopathy", done: false, streak: 1 },
  { id: 5, title: "Evening gratitude note", mins: 2, system: "Yoga", done: false, streak: 6 },
];

const BADGES = [
  { id: "b1", label: "7-Day Dinacharya", earned: true },
  { id: "b2", label: "Hydration Streak", earned: true },
  { id: "b3", label: "Calm Mornings x10", earned: false },
];

const PRACTITIONERS = [
  { id: 1, name: "Dr. Kavitha Ramesh", system: "Ayurveda", place: "Adyar, Chennai", rating: 4.8, verified: true, next: "Tomorrow, 10:30 AM" },
  { id: 2, name: "Dr. Faisal Ahmed", system: "Unani", place: "T. Nagar, Chennai", rating: 4.6, verified: true, next: "Fri, 4:00 PM" },
  { id: 3, name: "Siddha Wellness Centre", system: "Siddha", place: "Mylapore, Chennai", rating: 4.7, verified: true, next: "Mon, 9:00 AM" },
  { id: 4, name: "Dr. Priya Nair", system: "Naturopathy", place: "Besant Nagar, Chennai", rating: 4.9, verified: true, next: "Today, 6:00 PM" },
];

const PODS = [
  { id: 1, name: "Better Sleep Circle", members: 214, goal: "Sleep" },
  { id: 2, name: "Quiet Mind Mornings", members: 132, goal: "Stress" },
  { id: 3, name: "Joint-Friendly Movement", members: 88, goal: "Mobility" },
];

const RECIPE_BANK = [
  { match: ["turmeric", "milk"], title: "Warm Turmeric Haldi Doodh", note: "A calming evening drink, traditionally taken before sleep.", herb: "Turmeric — used for its warming, soothing qualities." },
  { match: ["rice", "moong", "ghee"], title: "Simple Moong Dal Khichdi", note: "Light and easy to digest, gentle on the system.", herb: "Cumin — aids digestion when tempered in ghee." },
  { match: ["ginger", "lemon"], title: "Ginger-Lemon Warm Sip", note: "A brightening sip good for sluggish mornings.", herb: "Ginger — traditionally used to kindle digestive fire (Agni)." },
];

const RED_FLAGS = [
  "chest pain", "can't breathe", "cannot breathe", "severe bleeding", "unconscious",
  "suicidal", "stroke", "seizure", "severe pain", "heart attack", "not breathing",
];

const LANGS = { en: "English", ta: "தமிழ்", hi: "हिन्दी", te: "తెలుగు" };

/* ------------------------------------------------------------------ */
/*  SMALL UI PRIMITIVES                                                */
/* ------------------------------------------------------------------ */
const Card = ({ children, className = "", style = {} }) => (
  <div
    className={`rounded-2xl border ${className}`}
    style={{ background: C.surface, borderColor: C.line, ...style }}
  >
    {children}
  </div>
);

const Pill = ({ children, tone = C.sage50, text = C.sage700 }) => (
  <span
    className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium font-body"
    style={{ background: tone, color: text }}
  >
    {children}
  </span>
);

const PrimaryButton = ({ children, onClick, className = "", icon: Icon }) => (
  <button
    onClick={onClick}
    className={`focus-ring inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-body font-semibold text-white transition-transform active:scale-95 ${className}`}
    style={{ background: C.sage700 }}
  >
    {children}{Icon && <Icon size={18} />}
  </button>
);

const GhostButton = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`focus-ring rounded-full px-5 py-2.5 font-body font-medium transition-colors ${className}`}
    style={{ color: C.sage700, border: `1.5px solid ${C.sage500}` }}
  >
    {children}
  </button>
);

/* ------------------------------------------------------------------ */
/*  NAVIGATION                                                         */
/* ------------------------------------------------------------------ */
const NAV_ITEMS = [
  { id: "landing", label: "Home", icon: Home },
  { id: "assessment", label: "Assessment", icon: Activity },
  { id: "dashboard", label: "Dashboard", icon: Sparkles },
  { id: "chat", label: "AI Assistant", icon: MessageCircle },
  { id: "pranayama", label: "Pranayama", icon: Wind },
  { id: "recipes", label: "Recipes", icon: ChefHat },
  { id: "locator", label: "Find Care", icon: MapPin },
  { id: "pods", label: "Community", icon: Users },
];

function TopNav({ view, setView, profile, setProfile, lang, setLang }) {
  const [showProfiles, setShowProfiles] = useState(false);
  const [showLang, setShowLang] = useState(false);
  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur"
      style={{ borderColor: C.line, background: "rgba(250,251,247,0.9)" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <button onClick={() => setView("landing")} className="focus-ring flex items-center gap-2 rounded-lg">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: C.sage700 }}>
            <Leaf size={18} color="white" />
          </div>
          <span className="font-display text-lg font-semibold" style={{ color: C.ink900 }}>AYUSYNC-AI</span>
        </button>

        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {NAV_ITEMS.map((n) => (
            <button
              key={n.id}
              onClick={() => setView(n.id)}
              className="focus-ring rounded-full px-3.5 py-2 font-body text-sm font-medium transition-colors"
              style={{
                background: view === n.id ? C.sage50 : "transparent",
                color: view === n.id ? C.sage700 : C.ink600,
              }}
            >
              {n.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowLang((s) => !s)}
              className="focus-ring flex items-center gap-1 rounded-full border px-3 py-2 text-sm font-body"
              style={{ borderColor: C.line, color: C.ink600 }}
            >
              <Globe size={15} /> {LANGS[lang]}
            </button>
            {showLang && (
              <div className="absolute right-0 top-11 w-36 overflow-hidden rounded-xl border shadow-lg" style={{ borderColor: C.line, background: C.surface }}>
                {Object.entries(LANGS).map(([k, v]) => (
                  <button
                    key={k}
                    onClick={() => { setLang(k); setShowLang(false); }}
                    className="block w-full px-4 py-2 text-left font-body text-sm hover:bg-[#EEF4EC]"
                    style={{ color: C.ink900 }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowProfiles((s) => !s)}
              className="focus-ring flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3"
              style={{ borderColor: C.line }}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: C.sky100 }}>
                <profile.icon size={16} color={C.sage700} />
              </div>
              <span className="hidden font-body text-sm sm:inline" style={{ color: C.ink900 }}>{profile.name}</span>
            </button>
            {showProfiles && (
              <div className="absolute right-0 top-12 w-52 overflow-hidden rounded-xl border shadow-lg" style={{ borderColor: C.line, background: C.surface }}>
                <p className="px-4 pt-3 pb-1 font-body text-xs uppercase tracking-wide" style={{ color: C.ink400 }}>Family accounts</p>
                {PROFILES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setProfile(p); setShowProfiles(false); }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left hover:bg-[#EEF4EC]"
                  >
                    <p.icon size={16} color={C.sage700} />
                    <span className="font-body text-sm" style={{ color: C.ink900 }}>{p.name}</span>
                    <span className="ml-auto font-body text-xs" style={{ color: C.ink400 }}>{p.relation}</span>
                  </button>
                ))}
                <button className="flex w-full items-center gap-2 border-t px-4 py-2.5 text-left font-body text-sm" style={{ borderColor: C.line, color: C.sage700 }}>
                  <Plus size={14} /> Add family member
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* mobile nav */}
      <div className="flex gap-1 overflow-x-auto border-t px-2 py-2 lg:hidden" style={{ borderColor: C.line }}>
        {NAV_ITEMS.map((n) => (
          <button
            key={n.id}
            onClick={() => setView(n.id)}
            className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 font-body text-xs font-medium"
            style={{ background: view === n.id ? C.sage50 : "transparent", color: view === n.id ? C.sage700 : C.ink600 }}
          >
            <n.icon size={13} /> {n.label}
          </button>
        ))}
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  LANDING                                                            */
/* ------------------------------------------------------------------ */
function Landing({ setView }) {
  return (
    <div className="rise-in">
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Pill><ShieldCheck size={13} /> Preventive wellness, not emergency care</Pill>
            <h1 className="font-display mt-5 text-4xl font-semibold leading-[1.08] sm:text-5xl" style={{ color: C.ink900 }}>
              Your AI-powered preventive wellness companion.
            </h1>
            <p className="font-body mt-5 max-w-lg text-lg leading-relaxed" style={{ color: C.ink600 }}>
              AYUSYNC-AI turns your everyday habits — sleep, movement, stress, water — into gentle,
              personalised AYUSH guidance, and connects you with verified practitioners nearby.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <PrimaryButton onClick={() => setView("assessment")} icon={ArrowRight}>Start your assessment</PrimaryButton>
              <GhostButton onClick={() => setView("chat")}>Talk to the AI assistant</GhostButton>
            </div>
            <div className="mt-8 flex items-start gap-2 rounded-xl p-3" style={{ background: C.sky100 }}>
              <AlertTriangle size={16} className="mt-0.5 shrink-0" color={C.clay500} />
              <p className="font-body text-xs leading-relaxed" style={{ color: C.ink600 }}>
                This platform offers preventive and educational guidance only. It does not diagnose conditions
                or replace emergency medical care. In an emergency, call your local emergency number immediately.
              </p>
            </div>
          </div>
          <div className="relative">
            <Card className="p-6" style={{ boxShadow: "0 20px 50px -25px rgba(63,92,66,0.35)" }}>
              <div className="flex items-center justify-between">
                <span className="font-body text-sm font-medium" style={{ color: C.ink600 }}>Today's balance</span>
                <Pill tone={C.sky100} text={C.sage700}>Vata-Pitta leaning</Pill>
              </div>
              <div className="mt-6 flex items-center gap-6">
                <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full" style={{ background: `conic-gradient(${C.sage500} 0% 68%, ${C.sage50} 68% 100%)` }}>
                  <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full" style={{ background: C.surface }}>
                    <span className="font-display text-2xl font-semibold" style={{ color: C.ink900 }}>68</span>
                    <span className="font-body text-[10px]" style={{ color: C.ink400 }}>/ 100</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  {[["Sleep", 70], ["Movement", 54], ["Calm", 62]].map(([l, v]) => (
                    <div key={l}>
                      <div className="flex justify-between font-body text-xs" style={{ color: C.ink600 }}>
                        <span>{l}</span><span>{v}%</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full rounded-full" style={{ background: C.sage50 }}>
                        <div className="h-1.5 rounded-full" style={{ width: `${v}%`, background: C.sage500 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-5 font-body text-xs" style={{ color: C.ink400 }}>A lifestyle-consistency score — not a medical diagnosis.</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-t py-16" style={{ borderColor: C.line, background: C.sage50 }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: C.ink900 }}>What you get</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: MessageCircle, title: "AI Wellness Chat", d: "Speak or type in your own words; the AI listens and screens for anything urgent first." },
              { icon: Sun, title: "Ritucharya, personalised", d: "Seasonal regimens tuned to the current month and your profile." },
              { icon: Leaf, title: "Dosha-based insights", d: "An educational lens on your tendencies — never a label to diagnose you by." },
              { icon: MapPin, title: "Practitioner discovery", d: "Verified AYUSH hospitals and practitioners near you, nothing unlicensed." },
            ].map((f) => (
              <Card key={f.title} className="p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: C.surface, border: `1px solid ${C.line}` }}>
                  <f.icon size={18} color={C.sage700} />
                </div>
                <h3 className="font-display mt-4 text-base font-semibold" style={{ color: C.ink900 }}>{f.title}</h3>
                <p className="font-body mt-1.5 text-sm leading-relaxed" style={{ color: C.ink600 }}>{f.d}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: C.ink900 }}>Six systems, one respectful overview</h2>
        <p className="font-body mt-2 max-w-2xl" style={{ color: C.ink600 }}>
          AYUSH stands for Ayurveda, Yoga, Naturopathy, Unani, Siddha and Homeopathy — India's recognised
          traditional systems of medicine, each with its own history and approach to prevention.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AYUSH_SYSTEMS.map((s) => (
            <Card key={s.name} className="p-5">
              <div className="h-1.5 w-10 rounded-full" style={{ background: s.color }} />
              <h3 className="font-display mt-4 text-lg font-semibold" style={{ color: C.ink900 }}>{s.name}</h3>
              <p className="font-body mt-1.5 text-sm leading-relaxed" style={{ color: C.ink600 }}>{s.blurb}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ASSESSMENT                                                         */
/* ------------------------------------------------------------------ */
const ASSESSMENT_STEPS = [
  { key: "sleep", title: "How has your sleep been?", icon: Moon,
    options: ["Under 5 hrs, restless", "5–6 hrs, okay", "7–8 hrs, steady", "8+ hrs, deep"] },
  { key: "activity", title: "How much do you move most days?", icon: Activity,
    options: ["Mostly seated", "A short walk here and there", "30 min of activity", "An hour or more"] },
  { key: "stress", title: "How would you describe your stress lately?", icon: Wind,
    options: ["Fairly calm", "Some tension", "Often on edge", "Overwhelmed most days"] },
  { key: "hydration", title: "How much water do you drink daily?", icon: Droplets,
    options: ["Under 1 litre", "1–1.5 litres", "2 litres", "2.5 litres or more"] },
  { key: "goal", title: "What matters most to you right now?", icon: Heart,
    options: ["Sleeping better", "Feeling calmer", "More energy", "General upkeep"] },
];

function Assessment({ onFinish }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const done = step >= ASSESSMENT_STEPS.length;
  const current = ASSESSMENT_STEPS[step];

  useEffect(() => { if (done) onFinish?.(answers); }, [done]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <div className="mb-8">
        <div className="flex items-center justify-between font-body text-xs" style={{ color: C.ink400 }}>
          <span>Wellness check-in</span>
          <span>{Math.min(step, ASSESSMENT_STEPS.length)} of {ASSESSMENT_STEPS.length}</span>
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full" style={{ background: C.sage50 }}>
          <div
            className="h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${(Math.min(step, ASSESSMENT_STEPS.length) / ASSESSMENT_STEPS.length) * 100}%`, background: C.sage500 }}
          />
        </div>
      </div>

      {!done ? (
        <Card key={current.key} className="rise-in p-7 sm:p-9">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: C.sage50 }}>
            <current.icon size={20} color={C.sage700} />
          </div>
          <h2 className="font-display mt-5 text-xl font-semibold sm:text-2xl" style={{ color: C.ink900 }}>{current.title}</h2>
          <p className="font-body mt-1 text-sm" style={{ color: C.ink400 }}>No wrong answers — this simply helps us personalise your plan.</p>
          <div className="mt-6 grid gap-3">
            {current.options.map((opt) => (
              <button
                key={opt}
                onClick={() => { setAnswers((a) => ({ ...a, [current.key]: opt })); setStep((s) => s + 1); }}
                className="focus-ring flex items-center justify-between rounded-xl border px-4 py-3.5 text-left font-body text-sm transition-colors hover:border-[#6E8F6A]"
                style={{ borderColor: C.line, color: C.ink900 }}
              >
                {opt} <ChevronRight size={16} color={C.ink400} />
              </button>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between">
            <button
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="focus-ring flex items-center gap-1 font-body text-sm disabled:opacity-30"
              style={{ color: C.ink600 }}
            >
              <ChevronLeft size={15} /> Back
            </button>
            <button className="font-body text-sm underline" style={{ color: C.ink400 }} onClick={() => setStep((s) => s + 1)}>
              Skip for now
            </button>
          </div>
        </Card>
      ) : (
        <Card className="rise-in p-9 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full" style={{ background: C.sage50 }}>
            <Check size={24} color={C.sage700} />
          </div>
          <h2 className="font-display mt-5 text-2xl font-semibold" style={{ color: C.ink900 }}>Your check-in is saved</h2>
          <p className="font-body mt-2 text-sm" style={{ color: C.ink600 }}>We'll use this alongside any connected wearable data to build your wellness profile.</p>
        </Card>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  DASHBOARD                                                          */
/* ------------------------------------------------------------------ */
function WearableCard({ label, value, icon: Icon, source }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: C.sky100 }}>
          <Icon size={16} color={C.sage700} />
        </div>
        <Pill tone={C.sage50} text={C.ink600}>{source}</Pill>
      </div>
      <p className="font-display mt-3 text-2xl font-semibold" style={{ color: C.ink900 }}>{value}</p>
      <p className="font-body text-xs" style={{ color: C.ink400 }}>{label}</p>
    </Card>
  );
}

function Dashboard({ profile }) {
  const [habits, setHabits] = useState(MICRO_HABITS);
  const toggle = (id) => setHabits((hs) => hs.map((h) => h.id === id ? { ...h, done: !h.done, streak: h.done ? h.streak - 1 : h.streak + 1 } : h));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 rise-in">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-body text-sm" style={{ color: C.ink400 }}>Wellness dashboard for</p>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: C.ink900 }}>{profile.name}</h1>
        </div>
        <Pill tone={C.sky100} text={C.sage700}><ShieldCheck size={12} /> Lifestyle score, not a diagnosis</Pill>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5 lg:col-span-1">
          <div className="flex items-center gap-5">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full" style={{ background: `conic-gradient(${C.sage500} 0% 68%, ${C.sage50} 68% 100%)` }}>
              <div className="flex h-[70px] w-[70px] flex-col items-center justify-center rounded-full" style={{ background: C.surface }}>
                <span className="font-display text-xl font-semibold" style={{ color: C.ink900 }}>68</span>
                <span className="font-body text-[9px]" style={{ color: C.ink400 }}>/ 100</span>
              </div>
            </div>
            <div>
              <p className="font-body text-sm font-semibold" style={{ color: C.ink900 }}>Steady & improving</p>
              <p className="font-body text-xs" style={{ color: C.ink400 }}>Vata-Pitta leaning tendency</p>
            </div>
          </div>
        </Card>
        <WearableCard label="Avg. sleep this week" value="6.6 hrs" icon={Moon} source="Google Fit" />
        <WearableCard label="Avg. daily steps" value="5,758" icon={Activity} source="Apple Health" />
        <WearableCard label="Resting heart rate" value="68 bpm" icon={Heart} source="Fitness band" />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-display text-base font-semibold" style={{ color: C.ink900 }}>Sleep, this week</h3>
          <div className="mt-3 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WEEKLY_SLEEP}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.line} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: C.ink400 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: C.ink400 }} axisLine={false} tickLine={false} width={28} />
                <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 12, fontFamily: "Karla" }} />
                <Line type="monotone" dataKey="hrs" stroke={C.sage500} strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-display text-base font-semibold" style={{ color: C.ink900 }}>Stress, this week</h3>
          <div className="mt-3 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_STRESS}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: C.ink400 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 12, fontFamily: "Karla" }} />
                <Bar dataKey="level" fill={C.clay400} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-semibold" style={{ color: C.ink900 }}>Today's micro-habits</h3>
            <Pill><Flame size={12} color={C.clay500} /> Keep it gentle, not perfect</Pill>
          </div>
          <div className="mt-4 space-y-2.5">
            {habits.map((h) => (
              <div key={h.id} className="flex items-center gap-3 rounded-xl border p-3" style={{ borderColor: C.line }}>
                <button
                  onClick={() => toggle(h.id)}
                  className="focus-ring flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                  style={{ borderColor: h.done ? C.sage700 : C.line, background: h.done ? C.sage700 : "transparent" }}
                >
                  {h.done && <Check size={13} color="white" />}
                </button>
                <div className="flex-1">
                  <p className="font-body text-sm font-medium" style={{ color: C.ink900, textDecoration: h.done ? "line-through" : "none" }}>{h.title}</p>
                  <p className="font-body text-xs" style={{ color: C.ink400 }}>{h.system} · {h.mins} min</p>
                </div>
                <Pill tone={C.gold400 + "22"} text={C.clay500}><Flame size={11} /> {h.streak}d</Pill>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-display text-base font-semibold" style={{ color: C.ink900 }}>Badges</h3>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {BADGES.map((b) => (
              <div key={b.id} className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: b.earned ? C.gold400 + "33" : C.sage50, opacity: b.earned ? 1 : 0.5 }}>
                  <Award size={22} color={b.earned ? C.clay500 : C.ink400} />
                </div>
                <span className="font-body text-[11px] leading-tight" style={{ color: C.ink600 }}>{b.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  AI CHAT + VOICE — with rule-based safety layer                     */
/* ------------------------------------------------------------------ */
function screenMessage(text) {
  const lower = text.toLowerCase();
  return RED_FLAGS.some((f) => lower.includes(f));
}

function wellnessReply(text) {
  const lower = text.toLowerCase();
  if (lower.includes("sleep") || lower.includes("tired") || lower.includes("late")) {
    return "Late nights can throw off your body's natural rhythm. Try winding down 30 minutes earlier tonight, with warm water and no screens, and see how tomorrow feels. Would you like a short evening routine?";
  }
  if (lower.includes("stress") || lower.includes("anxious") || lower.includes("overwhelm")) {
    return "That sounds like a lot to carry. A few rounds of slow, even breathing can help settle the nervous system before anything else. Want me to open the Pranayama Studio for a 3-minute session?";
  }
  if (lower.includes("digest") || lower.includes("stomach") || lower.includes("bloat")) {
    return "Digestion often reflects meal timing and pace. Eating your largest meal earlier in the day and sitting for a few minutes afterward can help. I can suggest a simple recipe if that's useful.";
  }
  return "Thanks for sharing that. Based on what you've told me, a small, steady change is usually more sustainable than a big one — would you like a gentle suggestion to try today?";
}

function ChatAssistant() {
  const [messages, setMessages] = useState([
    { from: "ai", text: "Namaskaram! Tell me how you've been feeling lately — in your own words, typed or spoken." },
  ]);
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, emergency]);

  const send = (text) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    const flagged = screenMessage(text);
    setTimeout(() => {
      if (flagged) {
        setEmergency(true);
        setMessages((m) => [...m, { from: "ai", text: "I'm stopping wellness suggestions here — what you're describing needs real medical attention, not an app.", urgent: true }]);
      } else {
        setEmergency(false);
        setMessages((m) => [...m, { from: "ai", text: wellnessReply(text) }]);
      }
    }, 450);
  };

  const toggleRecording = () => {
    setRecording((r) => !r);
    if (!recording) {
      setTimeout(() => { setRecording(false); send("I've been sleeping very late and I feel tired all day."); }, 1800);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 rise-in">
      <h1 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: C.ink900 }}>AI Wellness Assistant</h1>
      <p className="font-body mt-1 text-sm" style={{ color: C.ink600 }}>Every message is screened for urgent symptoms before any wellness guidance is offered.</p>

      {emergency && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border p-4" style={{ borderColor: C.clay500, background: "#FBEFE8" }}>
          <AlertTriangle size={20} className="mt-0.5 shrink-0" color={C.clay500} />
          <div>
            <p className="font-body text-sm font-semibold" style={{ color: C.ink900 }}>This may be a medical emergency</p>
            <p className="font-body mt-1 text-sm" style={{ color: C.ink600 }}>Please contact emergency services or go to the nearest hospital right away. AYUSYNC-AI cannot help with this — it is for preventive wellness only.</p>
            <div className="mt-2 flex gap-2">
              <a href="tel:108" className="focus-ring inline-flex items-center gap-1 rounded-full px-4 py-2 font-body text-xs font-semibold text-white" style={{ background: C.clay500 }}><Phone size={13} /> Call 108</a>
              <button onClick={() => setEmergency(false)} className="font-body text-xs underline" style={{ color: C.ink600 }}>Dismiss</button>
            </div>
          </div>
        </div>
      )}

      <Card className="mt-5 flex h-[440px] flex-col p-4">
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className="max-w-[80%] rounded-2xl px-4 py-2.5 font-body text-sm leading-relaxed"
                style={{
                  background: m.from === "user" ? C.sage700 : m.urgent ? "#FBEFE8" : C.sage50,
                  color: m.from === "user" ? "white" : C.ink900,
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="mt-3 flex items-center gap-2 border-t pt-3" style={{ borderColor: C.line }}>
          <button
            onClick={toggleRecording}
            className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            style={{ background: recording ? C.clay500 : C.sage50 }}
          >
            {recording ? <MicOff size={16} color="white" /> : <Mic size={16} color={C.sage700} />}
          </button>
          {recording && (
            <div className="flex items-center gap-0.5">
              {[6, 14, 9, 18, 7, 12].map((h, i) => (
                <div key={i} className="w-1 rounded-full" style={{ height: h, background: C.clay500, animation: `breathe-in 0.6s ease-in-out ${i * 0.08}s infinite alternate` }} />
              ))}
            </div>
          )}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Type how you're feeling..."
            className="focus-ring flex-1 rounded-full border px-4 py-2.5 font-body text-sm"
            style={{ borderColor: C.line }}
          />
          <button onClick={() => send(input)} className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ background: C.sage700 }}>
            <Send size={15} color="white" />
          </button>
        </div>
      </Card>
      <div className="mt-3 flex flex-wrap gap-2">
        {["Chest pain since morning", "I've been sleeping very late", "My stomach feels bloated"].map((s) => (
          <button key={s} onClick={() => send(s)} className="focus-ring rounded-full border px-3 py-1.5 font-body text-xs" style={{ borderColor: C.line, color: C.ink600 }}>{s}</button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PRANAYAMA STUDIO                                                   */
/* ------------------------------------------------------------------ */
const SESSIONS = [
  { id: 1, title: "Anulom Vilom", d: "Alternate nostril breathing to steady the mind.", mins: 3, pace: 4 },
  { id: 2, title: "Bhramari", d: "Humming breath to ease tension quickly.", mins: 2, pace: 5 },
  { id: 3, title: "Deep Belly Breathing", d: "Slow diaphragmatic breathing for calm.", mins: 4, pace: 6 },
];

function PranayamaStudio() {
  const [active, setActive] = useState(SESSIONS[0]);
  const [playing, setPlaying] = useState(false);
  const [phase, setPhase] = useState("in");

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setPhase((p) => (p === "in" ? "out" : "in")), active.pace * 1000);
    return () => clearInterval(t);
  }, [playing, active]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 rise-in">
      <h1 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: C.ink900 }}>Pranayama Studio</h1>
      <p className="font-body mt-1 text-sm" style={{ color: C.ink600 }}>Guided breathing sessions that adapt their pace to how stressed you're feeling.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="flex flex-col items-center justify-center p-10">
          <div
            className="flex h-56 w-56 items-center justify-center rounded-full"
            style={{
              background: `radial-gradient(circle, ${C.sky100}, ${C.sage50})`,
              animation: playing ? `${phase === "in" ? "breathe-in" : "breathe-out"} ${active.pace}s ease-in-out infinite alternate` : "none",
              transform: playing ? undefined : "scale(0.75)",
              transition: "transform 0.6s ease",
            }}
          >
            <div className="flex h-28 w-28 items-center justify-center rounded-full" style={{ background: C.surface, boxShadow: "0 10px 30px -12px rgba(63,92,66,.35)" }}>
              <span className="font-display text-sm font-semibold" style={{ color: C.sage700 }}>{playing ? (phase === "in" ? "Inhale" : "Exhale") : "Ready"}</span>
            </div>
          </div>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="focus-ring mt-8 flex items-center gap-2 rounded-full px-6 py-3 font-body font-semibold text-white"
            style={{ background: C.sage700 }}
          >
            {playing ? <PauseCircle size={18} /> : <PlayCircle size={18} />} {playing ? "Pause session" : `Start ${active.title}`}
          </button>
          <p className="font-body mt-3 flex items-center gap-1 text-xs" style={{ color: C.ink400 }}><Volume2 size={13} /> Guided audio cues included</p>
        </Card>

        <div className="space-y-3">
          {SESSIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => { setActive(s); setPlaying(false); }}
              className="focus-ring block w-full text-left"
            >
              <Card className={`p-4 ${active.id === s.id ? "" : ""}`} style={{ borderColor: active.id === s.id ? C.sage500 : C.line, borderWidth: active.id === s.id ? 2 : 1 }}>
                <div className="flex items-center justify-between">
                  <h3 className="font-body text-sm font-semibold" style={{ color: C.ink900 }}>{s.title}</h3>
                  <Pill><Clock size={11} /> {s.mins}m</Pill>
                </div>
                <p className="font-body mt-1 text-xs" style={{ color: C.ink600 }}>{s.d}</p>
              </Card>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  RECIPE ENGINE                                                      */
/* ------------------------------------------------------------------ */
function RecipeEngine() {
  const [ingredients, setIngredients] = useState("");
  const [results, setResults] = useState(null);

  const generate = () => {
    const list = ingredients.toLowerCase().split(",").map((s) => s.trim()).filter(Boolean);
    const matches = RECIPE_BANK.filter((r) => r.match.some((m) => list.some((i) => i.includes(m) || m.includes(i))));
    setResults(matches.length ? matches : [RECIPE_BANK[2]]);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 rise-in">
      <h1 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: C.ink900 }}>Prakriti-Aligned Recipes</h1>
      <p className="font-body mt-1 text-sm" style={{ color: C.ink600 }}>Tell us what's in your kitchen, and get a preventive, seasonal recipe suited to your profile.</p>

      <Card className="mt-5 p-5">
        <label className="font-body text-xs font-medium" style={{ color: C.ink600 }}>Ingredients you have (comma separated)</label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="turmeric, milk, ginger..."
            className="focus-ring flex-1 rounded-xl border px-4 py-2.5 font-body text-sm"
            style={{ borderColor: C.line }}
          />
          <PrimaryButton onClick={generate} icon={ChefHat}>Suggest a recipe</PrimaryButton>
        </div>
      </Card>

      {results && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {results.map((r) => (
            <Card key={r.title} className="rise-in p-5">
              <h3 className="font-display text-lg font-semibold" style={{ color: C.ink900 }}>{r.title}</h3>
              <p className="font-body mt-1.5 text-sm" style={{ color: C.ink600 }}>{r.note}</p>
              <div className="mt-3 rounded-lg p-3" style={{ background: C.sage50 }}>
                <p className="font-body text-xs font-semibold" style={{ color: C.sage700 }}>Botanical note</p>
                <p className="font-body mt-0.5 text-xs" style={{ color: C.ink600 }}>{r.herb}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SERVICE LOCATOR                                                    */
/* ------------------------------------------------------------------ */
function ServiceLocator() {
  const [system, setSystem] = useState("All");
  const systems = ["All", ...new Set(PRACTITIONERS.map((p) => p.system))];
  const filtered = system === "All" ? PRACTITIONERS : PRACTITIONERS.filter((p) => p.system === system);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 rise-in">
      <h1 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: C.ink900 }}>Find verified AYUSH care</h1>
      <p className="font-body mt-1 flex items-center gap-1.5 text-sm" style={{ color: C.ink600 }}>
        <ShieldCheck size={14} color={C.sage700} /> Only officially verified practitioners and centres are listed.
      </p>

      <div className="mt-5 flex items-center gap-2 overflow-x-auto">
        <Filter size={15} color={C.ink400} className="shrink-0" />
        {systems.map((s) => (
          <button
            key={s}
            onClick={() => setSystem(s)}
            className="focus-ring shrink-0 rounded-full px-3.5 py-1.5 font-body text-xs font-medium"
            style={{ background: system === s ? C.sage700 : C.sage50, color: system === s ? "white" : C.sage700 }}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {filtered.map((p) => (
          <Card key={p.id} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-base font-semibold" style={{ color: C.ink900 }}>{p.name}</h3>
                <p className="font-body mt-0.5 flex items-center gap-1 text-xs" style={{ color: C.ink400 }}><MapPin size={12} /> {p.place}</p>
              </div>
              {p.verified && <Pill tone={C.sage50} text={C.sage700}><ShieldCheck size={11} /> Verified</Pill>}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Pill>{p.system}</Pill>
              <span className="flex items-center gap-1 font-body text-xs" style={{ color: C.ink600 }}><Star size={12} fill={C.gold400} color={C.gold400} /> {p.rating}</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t pt-3" style={{ borderColor: C.line }}>
              <span className="flex items-center gap-1 font-body text-xs" style={{ color: C.ink600 }}><Clock size={12} /> Next: {p.next}</span>
              <GhostButton className="!px-4 !py-1.5 !text-xs">Book</GhostButton>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  COMMUNITY PODS                                                     */
/* ------------------------------------------------------------------ */
function CommunityPods() {
  const [openPod, setOpenPod] = useState(null);
  const [draft, setDraft] = useState("");
  const [posts, setPosts] = useState([
    { id: 1, text: "Started sleeping by 10pm this week and it's genuinely helped my mornings.", flagged: false },
    { id: 2, text: "Anyone else finding warm water first thing actually works?", flagged: false },
  ]);

  const submitPost = () => {
    if (!draft.trim()) return;
    const flagged = /\b(dosage|prescribe|medicine name|mg\b|tablet)\b/i.test(draft);
    setPosts((p) => [{ id: Date.now(), text: draft, flagged }, ...p]);
    setDraft("");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 rise-in">
      <h1 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: C.ink900 }}>Moderated Wellness Pods</h1>
      <p className="font-body mt-1 text-sm" style={{ color: C.ink600 }}>Anonymous, opt-in peer support — automatically screened to keep medical advice out.</p>

      {!openPod ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {PODS.map((p) => (
            <Card key={p.id} className="p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: C.sage50 }}>
                <Users size={16} color={C.sage700} />
              </div>
              <h3 className="font-display mt-3 text-base font-semibold" style={{ color: C.ink900 }}>{p.name}</h3>
              <p className="font-body mt-1 text-xs" style={{ color: C.ink400 }}>{p.members} members · {p.goal}</p>
              <GhostButton className="mt-4 w-full !text-xs" onClick={() => setOpenPod(p)}>Join pod</GhostButton>
            </Card>
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <button onClick={() => setOpenPod(null)} className="focus-ring flex items-center gap-1 font-body text-sm" style={{ color: C.sage700 }}>
            <ChevronLeft size={15} /> All pods
          </button>
          <Card className="mt-3 p-5">
            <h2 className="font-display text-lg font-semibold" style={{ color: C.ink900 }}>{openPod.name}</h2>
            <div className="mt-4 flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Share something anonymously..."
                className="focus-ring flex-1 rounded-full border px-4 py-2.5 font-body text-sm"
                style={{ borderColor: C.line }}
              />
              <PrimaryButton onClick={submitPost}>Post</PrimaryButton>
            </div>
            <div className="mt-5 space-y-3">
              {posts.map((p) => (
                <div key={p.id} className="rounded-xl border p-3.5" style={{ borderColor: p.flagged ? C.clay500 : C.line }}>
                  <p className="font-body text-sm" style={{ color: C.ink900 }}>{p.text}</p>
                  {p.flagged && (
                    <p className="mt-2 flex items-center gap-1 font-body text-xs font-medium" style={{ color: C.clay500 }}>
                      <AlertTriangle size={12} /> Flagged for review — this pod is for peer support, not medical advice.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  APP SHELL                                                          */
/* ------------------------------------------------------------------ */
export default function App() {
  const [view, setView] = useState("landing");
  const [profile, setProfile] = useState(PROFILES[0]);
  const [lang, setLang] = useState("en");

  const screens = {
    landing: <Landing setView={setView} />,
    assessment: <Assessment onFinish={() => {}} />,
    dashboard: <Dashboard profile={profile} />,
    chat: <ChatAssistant />,
    pranayama: <PranayamaStudio />,
    recipes: <RecipeEngine />,
    locator: <ServiceLocator />,
    pods: <CommunityPods />,
  };

  return (
    <div className="min-h-screen font-body" style={{ background: C.base }}>
      {FONTS}
      <TopNav view={view} setView={setView} profile={profile} setProfile={setProfile} lang={lang} setLang={setLang} />
      {screens[view]}
      <footer className="border-t py-6 text-center" style={{ borderColor: C.line }}>
        <p className="font-body text-xs" style={{ color: C.ink400 }}>
          AYUSYNC-AI provides preventive, educational wellness guidance only — it is not a substitute for medical diagnosis or emergency care.
        </p>
      </footer>
    </div>
  );
}
