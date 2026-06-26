import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { fetchAnimeInfo } from '../services/api';
import './Home.css';

const customEase = [0.76, 0, 0.24, 1];

// ── Hero background videos — ONLY confirmed embeddable IDs (tested via oembed API) ──
const HERO_VIDEOS = [
  { id: "8OkpRK2_gVs", title: "GUREN NO YUMIYA — OPENING 1" },
  { id: "MGRm4IzK1SQ", title: "FINAL SEASON — OFFICIAL TRAILER" },
  { id: "TX2Y2m7NoZg", title: "SEASON 3 — OFFICIAL PREVIEW" },
  { id: "Bcjm5Wy6LjY", title: "FINAL BATTLE — ANNOUNCEMENT" },
  { id: "uF0u7C5zWwQ", title: "ALL OPENINGS & ENDINGS" },
];

// ✅ Using verified MAL CDN — CORS open, 200 OK
const MAIN_CHARACTERS = [
  {
    name: "EREN YEAGER",
    role: "Protagonist / Attack Titan",
    img: "https://cdn.myanimelist.net/images/characters/10/216895.jpg?s=ccb6539cbfc5462df97d61a48c52af93",
    quote: '"I will keep moving forward until my enemies are destroyed."',
    color: "#6b0000"
  },
  {
    name: "MIKASA ACKERMANN",
    role: "Scout Regiment / Elite Soldier",
    img: "https://cdn.myanimelist.net/images/characters/9/215563.jpg?s=5b0650bb09a7e053afc6bad84ab48947",
    quote: '"The world is cruel, but also very beautiful."',
    color: "#0a2a4a"
  },
  {
    name: "ARMIN ARLELT",
    role: "Scout Regiment / Colossal Titan",
    img: "https://cdn.myanimelist.net/images/characters/8/220267.jpg?s=afa2751e2201aba1f5179544e787ba1a",
    quote: "\"It's not about if you can do it. It's about having the guts to try.\"",
    color: "#2a1a00"
  },
  {
    name: "LEVI ACKERMANN",
    role: "Humanity's Strongest Soldier",
    img: "https://cdn.myanimelist.net/images/characters/2/241413.jpg?s=1a789f9d4c7a441881e4b06a75bd91db",
    quote: '"No matter what happens, you don\'t need to regret it. You chose... the result you\'d chosen."',
    color: "#0a1a2a"
  },
];

const SERIES_STATS = [
  { label: "Total Seasons", value: "4" },
  { label: "Total Episodes", value: "94+" },
  { label: "MAL Score", value: "9.0" },
  { label: "MAL Rank", value: "#2" },
  { label: "Studio", value: "MAPPA" },
  { label: "Genre", value: "Dark Fantasy" },
];

const ABOUT_STATS = [
  { label: "Manga Chapters", value: "139" },
  { label: "Volumes", value: "34" },
  { label: "Original Run", value: "2013–2023" },
  { label: "Manga Author", value: "Hajime Isayama" },
];

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!";
function useTextScramble(text) {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    let frame = 0;
    const totalFrames = 18;
    const id = setInterval(() => {
      setDisplay(
        text.split("").map((ch, i) =>
          frame / totalFrames > i / text.length
            ? ch
            : ch === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)]
        ).join("")
      );
      if (++frame > totalFrames) clearInterval(id);
    }, 35);
    return () => clearInterval(id);
  }, [text]);
  return display;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Home() {
  const [animeData, setAnimeData] = useState(null);
  const [activeChar, setActiveChar] = useState(0);

  // Hero video cycling
  const [heroIdx, setHeroIdx] = useState(0);
  const [heroFade, setHeroFade] = useState(true);

  const heroRef = useRef(null);
  const freedomRef = useRef(null);
  const isInView = useInView(freedomRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Fetch synopsis
  useEffect(() => { fetchAnimeInfo().then(d => setAnimeData(d.data)).catch(console.error); }, []);

  // Auto-rotate characters every 5s
  useEffect(() => {
    const t = setInterval(() => {
      setActiveChar(c => (c + 1) % MAIN_CHARACTERS.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  // Auto-cycle hero video every 60s with crossfade
  useEffect(() => {
    const t = setInterval(() => {
      setHeroFade(false);
      setTimeout(() => {
        setHeroIdx(i => (i + 1) % HERO_VIDEOS.length);
        setHeroFade(true);
      }, 900);
    }, 60000);
    return () => clearInterval(t);
  }, []);

  const switchHeroVideo = (i) => {
    if (i === heroIdx) return;
    setHeroFade(false);
    setTimeout(() => { setHeroIdx(i); setHeroFade(true); }, 600);
  };

  const charName = useTextScramble(MAIN_CHARACTERS[activeChar].name);
  const handleCharSwitch = (i) => setActiveChar(i);

  return (
    <div className="home-page">

      {/* ─── HERO WITH CYCLING VIDEOS ────────────────────── */}
      <section className="hero-section" ref={heroRef}>
        <motion.div className="hero-video-wrap" style={{ y: heroY }}>
          <iframe
            key={heroIdx}
            className="hero-video-iframe"
            style={{ opacity: heroFade ? 1 : 0, transition: 'opacity 0.9s ease' }}
            src={`https://www.youtube.com/embed/${HERO_VIDEOS[heroIdx].id}?autoplay=1&mute=1&loop=1&playlist=${HERO_VIDEOS[heroIdx].id}&controls=0&showinfo=0&rel=0&modestbranding=1&vq=hd1080`}
            title={HERO_VIDEOS[heroIdx].title}
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
          <div className="hero-video-overlay" />

          {/* ── Video switcher bar bottom-left ── */}
          <div className="hero-video-indicator">
            <span className="hero-vid-label">▶ {HERO_VIDEOS[heroIdx].title}</span>
            <div className="hero-vid-dots">
              {HERO_VIDEOS.map((v, i) => (
                <button key={i}
                  className={`hero-vid-dot ${i === heroIdx ? 'active' : ''}`}
                  onClick={() => switchHeroVideo(i)}
                  title={v.title}
                />
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div className="hero-content container" style={{ opacity: heroOpacity }}>
          <motion.p className="hero-eyebrow"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: customEase }}>
            ✦ SHINGEKI NO KYOJIN
          </motion.p>
          <motion.h1 className="hero-title"
            initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1.2, ease: customEase }}>
            ATTACK<br /><span className="hero-title-red">ON TITAN</span>
          </motion.h1>
          <motion.p className="hero-tagline"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.9, ease: customEase }}>
            <em>Beyond the Walls Lies Truth</em>
          </motion.p>
          <motion.div className="hero-ctas"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8, ease: customEase }}>
            <NavLink to="/episodes" className="btn btn-primary">ENTER THE WALLS</NavLink>
            <NavLink to="/titans" className="btn btn-outline">MEET THE TITANS</NavLink>
          </motion.div>
        </motion.div>

        <div className="hero-scroll-cue">
          <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2 }}>↓</motion.span>
          {" "}SCROLL BEYOND THE WALLS
        </div>
      </section>

      {/* ─── STATS BAND ──────────────────────────────────── */}
      <section className="stats-band">
        {SERIES_STATS.map((s, i) => (
          <motion.div key={i} className="stat-pill"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.8, ease: customEase }}>
            <span className="stat-pill-val">{s.value}</span>
            <span className="stat-pill-lbl">{s.label}</span>
          </motion.div>
        ))}
      </section>

      {/* ─── FREEDOM SECTION ─────────────────────────────── */}
      <section className="freedom-section" ref={freedomRef}>
        <div className="freedom-inner">
          {["FREEDOM", "BELONGS TO", "THOSE WHO"].map((line, i) => (
            <div key={i} className="freedom-line-wrap">
              <motion.span
                className="freedom-line"
                initial={{ y: "110%" }}
                animate={isInView ? { y: "0%" } : { y: "110%" }}
                transition={{ delay: i * 0.15, duration: 1.1, ease: customEase }}>
                {line}
              </motion.span>
            </div>
          ))}
          <div className="freedom-line-wrap">
            <motion.span
              className="freedom-line freedom-red"
              initial={{ y: "110%" }}
              animate={isInView ? { y: "0%" } : { y: "110%" }}
              transition={{ delay: 0.45, duration: 1.1, ease: customEase }}>
              ADVANCE
            </motion.span>
          </div>
          <motion.p className="freedom-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.75, duration: 1, ease: customEase }}>
            This is more than a journey. More than a legend.<br />
            Stand where heroes once stood. Witness the unknown.
          </motion.p>
        </div>
      </section>

      {/* ─── MAIN CHARACTERS ─────────────────────────────── */}
      <section className="characters-section container">
        <motion.div className="section-header"
          initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8, ease: customEase }}>
          <span className="section-eyebrow">THE SCOUTS</span>
          <h2 className="section-title">MAIN CHARACTERS</h2>
        </motion.div>

        <div className="char-showcase">
          <div className="char-thumbnails">
            {MAIN_CHARACTERS.map((c, i) => (
              <motion.button key={i}
                className={`char-thumb ${activeChar === i ? 'active' : ''}`}
                onClick={() => handleCharSwitch(i)}
                whileHover={{ scale: 1.05 }}>
                <img src={c.img} alt={c.name}
                  onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/200x300/141414/8a0303?text=AOT'; }} />
              </motion.button>
            ))}
          </div>

          <div className="char-featured">
            <AnimatePresence mode="wait">
              <motion.div key={activeChar}
                className="char-featured-card"
                initial={{ opacity: 0, x: 60, filter: "blur(8px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -40, filter: "blur(8px)" }}
                transition={{ duration: 0.65, ease: customEase }}>
                <div className="char-featured-img-wrap">
                  <img src={MAIN_CHARACTERS[activeChar].img} alt={MAIN_CHARACTERS[activeChar].name}
                    onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x600/141414/8a0303?text=AOT'; }} />
                  <div className="char-featured-glow"
                    style={{ background: `linear-gradient(to top, ${MAIN_CHARACTERS[activeChar].color}88, transparent)` }} />
                </div>
                <div className="char-featured-info">
                  <span className="char-featured-role">{MAIN_CHARACTERS[activeChar].role}</span>
                  <h3 className="char-featured-name char-scramble">{charName}</h3>
                  <blockquote className="char-featured-quote">{MAIN_CHARACTERS[activeChar].quote}</blockquote>
                  <NavLink to="/characters" className="btn btn-outline sm">VIEW ALL CHARACTERS →</NavLink>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ─── SYNOPSIS ────────────────────────────────────── */}
      <section className="synopsis-section container">
        <motion.div className="synopsis-inner"
          initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 1, ease: customEase }}>
          <div className="section-header">
            <span className="section-eyebrow">THE STORY</span>
            <h2 className="section-title">SYNOPSIS</h2>
          </div>
          <p className="synopsis-text">
            {animeData?.synopsis ??
              "Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called Titans, forcing humans to hide in fear behind enormous concentric walls. What makes these giants truly terrifying is that their taste for human flesh is not born out of hunger—but what appears to be out of pleasure. To ensure their survival, the remnants of humanity began living within defensive barriers, resulting in one hundred years without a single titan encounter. That is, until a colossal titan manages to breach the supposedly impenetrable outer wall, reigniting the fight for survival against the man-eating abominations."}
          </p>
          <div className="about-stats">
            {ABOUT_STATS.map((s, i) => (
              <motion.div key={i} className="about-stat"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7, ease: customEase }}>
                <span className="about-stat-val">{s.value}</span>
                <span className="about-stat-lbl">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

    </div>
  );
}
