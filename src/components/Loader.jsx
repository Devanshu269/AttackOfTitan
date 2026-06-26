import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Loader.css';

const LOADING_TEXTS = [
  "YEAR 854...",
  "BEYOND THESE WALLS...",
  "DEDICATE YOUR HEART",
  "SHINZOU WO SASAGEYO"
];

const Loader = ({ onComplete }) => {
  const [textIndex, setTextIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('loading'); // 'loading' | 'reveal'

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + 1.2;
        if (next >= 100) {
          clearInterval(interval);
          setPhase('reveal');
          return 100;
        }
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setTextIndex(i => (i + 1) % LOADING_TEXTS.length);
    }, 900);
    return () => clearInterval(textInterval);
  }, []);

  useEffect(() => {
    if (phase === 'reveal') {
      const t = setTimeout(() => {
        if (onComplete) onComplete();
      }, 1400);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  return (
    <motion.div
      className="loader-root"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Background vertical scan lines — AoT signal aesthetic */}
      <div className="scan-lines" />

      {/* Top and bottom bar reveals like film opening */}
      <AnimatePresence>
        {phase === 'reveal' && (
          <>
            <motion.div
              className="reveal-bar top"
              initial={{ scaleY: 1 }}
              animate={{ scaleY: 0 }}
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            />
            <motion.div
              className="reveal-bar bottom"
              initial={{ scaleY: 1 }}
              animate={{ scaleY: 0 }}
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Scout Regiment Wings of Freedom SVG Logo */}
      <div className="loader-center">
        <motion.svg
          className="wings-svg"
          viewBox="0 0 200 120"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Left wing */}
          <motion.path
            d="M100,60 C90,40 60,20 20,30 C40,50 55,55 65,58 C45,52 25,55 10,75 C30,65 55,65 70,62 C50,65 35,75 30,95 C50,80 70,72 80,68 C65,75 60,88 65,105 C75,85 85,75 90,70 Z"
            fill="none"
            stroke="var(--primary-color)"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
          />
          {/* Right wing (mirrored) */}
          <motion.path
            d="M100,60 C110,40 140,20 180,30 C160,50 145,55 135,58 C155,52 175,55 190,75 C170,65 145,65 130,62 C150,65 165,75 170,95 C150,80 130,72 120,68 C135,75 140,88 135,105 C125,85 115,75 110,70 Z"
            fill="none"
            stroke="var(--primary-color)"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
          />
          {/* Center blade */}
          <motion.rect
            x="97" y="42" width="6" height="35" rx="2"
            fill="var(--primary-light)"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            style={{ transformOrigin: 'top center' }}
          />
        </motion.svg>

        {/* Loading text */}
        <div className="loader-text-block">
          <AnimatePresence mode="wait">
            <motion.p
              key={textIndex}
              className="loader-phrase"
              initial={{ y: 20, opacity: 0, filter: "blur(6px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -20, opacity: 0, filter: "blur(6px)" }}
              transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            >
              {LOADING_TEXTS[textIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="loader-progress-track">
          <motion.div
            className="loader-progress-fill"
            style={{ scaleX: progress / 100 }}
            transition={{ duration: 0.05 }}
          />
          <motion.div
            className="loader-progress-glow"
            style={{ left: `${progress}%` }}
          />
        </div>

        <motion.p
          className="loader-percent"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          {Math.floor(progress)}%
        </motion.p>
      </div>

      {/* Corner marks — like tactical HUD */}
      <div className="hud-corner top-left" />
      <div className="hud-corner top-right" />
      <div className="hud-corner bottom-left" />
      <div className="hud-corner bottom-right" />
    </motion.div>
  );
};

export default Loader;
