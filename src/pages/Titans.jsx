import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TITANS_DATA } from '../services/api';
import './Titans.css';

const customEase = [0.76, 0, 0.24, 1];

export default function Titans() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const prev = () => { setDirection(-1); setCurrent(c => (c - 1 + TITANS_DATA.length) % TITANS_DATA.length); };
  const next = () => { setDirection(1);  setCurrent(c => (c + 1) % TITANS_DATA.length); };

  const getPrev = () => (current - 1 + TITANS_DATA.length) % TITANS_DATA.length;
  const getNext = () => (current + 1) % TITANS_DATA.length;

  const titan = TITANS_DATA[current];

  const variants = {
    enter:  (d) => ({ opacity: 0, x: d > 0 ? 120 : -120, scale: 0.85, filter: 'blur(6px)' }),
    center: { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.7, ease: customEase } },
    exit:   (d) => ({ opacity: 0, x: d < 0 ? 120 : -120, scale: 0.85, filter: 'blur(6px)', transition: { duration: 0.5, ease: customEase } }),
  };

  return (
    <motion.div className="titans-page page-container"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}>

      {/* ── SECTION HEADER ───────── */}
      <div className="titans-header">
        <span className="titans-eyebrow">THE NINE TITANS</span>
        <div className="titans-title-bar">
          <div className="titans-indicator-line" />
        </div>
      </div>

      {/* ── MAIN CAROUSEL ─────────── */}
      <div className="titan-carousel-wrap">

        {/* Background giant watermark text */}
        <AnimatePresence mode="wait">
          <motion.span
            key={`wm-${current}`}
            className="titan-watermark"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}>
            {titan.name.split(' ').slice(0, 2).join(' ').toUpperCase()}
          </motion.span>
        </AnimatePresence>

        {/* Previous titan — dim left ghost */}
        <button className="titan-ghost titan-ghost-prev" onClick={prev} aria-label="Previous titan">
          <img src={TITANS_DATA[getPrev()].img} alt={TITANS_DATA[getPrev()].name}
            onError={e => { e.target.src = 'https://via.placeholder.com/300x500/111/333?text=AOT'; }} />
        </button>

        {/* Center active titan */}
        <div className="titan-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={current} className="titan-center-inner"
              variants={variants} initial="enter" animate="center" exit="exit" custom={direction}>
              <img src={titan.img} alt={titan.name}
                onError={e => { e.target.src = 'https://via.placeholder.com/400x600/111/333?text=AOT'; }} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Next titan — dim right ghost */}
        <button className="titan-ghost titan-ghost-next" onClick={next} aria-label="Next titan">
          <img src={TITANS_DATA[getNext()].img} alt={TITANS_DATA[getNext()].name}
            onError={e => { e.target.src = 'https://via.placeholder.com/300x500/111/333?text=AOT'; }} />
        </button>
      </div>

      {/* ── TITAN NAME ───────────── */}
      <AnimatePresence mode="wait">
        <motion.p key={`name-${current}`} className="titan-name-display"
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.5, ease: customEase }}>
          {titan.name.toUpperCase()}
        </motion.p>
      </AnimatePresence>

      {/* ── CONTROLS ─────────────── */}
      <div className="titan-controls">
        <button className="titan-ctrl-btn" onClick={prev}>← PREV</button>
        <div className="titan-dots">
          {TITANS_DATA.map((_, i) => (
            <button key={i} className={`titan-dot ${i === current ? 'active' : ''}`}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }} />
          ))}
        </div>
        <button className="titan-ctrl-btn" onClick={next}>NEXT →</button>
      </div>

      {/* ── INFO PANEL ───────────── */}
      <AnimatePresence mode="wait">
        <motion.div key={`info-${current}`} className="titan-info-band container"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: customEase }}>

          <div className="titan-info-header">
            <span className="titan-info-num"># {String(current + 1).padStart(2, '0')}</span>
            <h2 className="titan-info-name">{titan.name}</h2>
            <span className={`allegiance-pill ${titan.allegiance.toLowerCase()}`}>{titan.allegiance}</span>
          </div>

          <div className="titan-info-body">
            <div className="titan-info-col">
              <div className="info-row"><span>HEIGHT</span><strong>{titan.height}</strong></div>
              <div className="info-row"><span>ALLEGIANCE</span><strong>{titan.allegiance}</strong></div>
            </div>
            <div className="titan-info-desc">
              <p>{titan.description}</p>
            </div>
            <div className="titan-info-abilities">
              <span className="abilities-lbl">ABILITIES</span>
              <ul>
                {titan.abilities.map((a, i) => (
                  <motion.li key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}>
                    {a}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
