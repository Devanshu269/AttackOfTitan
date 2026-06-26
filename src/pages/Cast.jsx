import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchAnimeStaff } from '../services/api';
import './Cast.css';

const customEase = [0.76, 0, 0.24, 1];

// ✅ Character images from cdn.myanimelist.net — CORS open, verified HTTP 200
const MAIN_CAST = [
  { character: "Eren Yeager",      voice_jp: "Yuki Kaji",        voice_en: "Bryce Papenbrook", img: "https://cdn.myanimelist.net/images/characters/10/216895.jpg?s=ccb6539cbfc5462df97d61a48c52af93" },
  { character: "Mikasa Ackermann", voice_jp: "Yui Ishikawa",     voice_en: "Trina Nishimura",  img: "https://cdn.myanimelist.net/images/characters/9/215563.jpg?s=5b0650bb09a7e053afc6bad84ab48947" },
  { character: "Armin Arlelt",     voice_jp: "Marina Inoue",     voice_en: "Josh Grelle",      img: "https://cdn.myanimelist.net/images/characters/8/220267.jpg?s=afa2751e2201aba1f5179544e787ba1a" },
  { character: "Levi Ackermann",   voice_jp: "Hiroshi Kamiya",   voice_en: "Matthew Mercer",   img: "https://cdn.myanimelist.net/images/characters/2/241413.jpg?s=1a789f9d4c7a441881e4b06a75bd91db" },
  { character: "Hange Zoë",        voice_jp: "Romi Park",        voice_en: "Jessica Calvello", img: "https://cdn.myanimelist.net/images/characters/15/208637.jpg?s=3cfdcb5ec72bf4fbd01291026f8c955c" },
  { character: "Erwin Smith",      voice_jp: "Daisuke Ono",      voice_en: "J. Michael Tatum", img: "https://cdn.myanimelist.net/images/characters/14/559023.jpg?s=148a0689d341e23cae536207d030f3fc" },
  { character: "Reiner Braun",     voice_jp: "Yoshimasa Hosoya", voice_en: "Robert McCollum",  img: "https://cdn.myanimelist.net/images/characters/16/206489.jpg?s=e48695a419dc6e71c831d7481a5fc86f" },
  { character: "Annie Leonhart",   voice_jp: "Yu Shimamura",     voice_en: "Lauren Landa",     img: "https://cdn.myanimelist.net/images/characters/9/206357.jpg?s=3a853fc7177a3eeaefbecb530d590a4a" },
];

const PRODUCTION_INFO = [
  { label: "Original Manga",    value: "Hajime Isayama" },
  { label: "Director (S1-3)",   value: "Tetsurō Araki" },
  { label: "Director (S4)",     value: "Yuichiro Hayashi" },
  { label: "Chief Director",    value: "Jun Shishido" },
  { label: "Music Composer",    value: "Hiroyuki Sawano" },
  { label: "Studio (S1-3)",     value: "Wit Studio" },
  { label: "Studio (S4)",       value: "MAPPA" },
  { label: "Original Run",      value: "Apr 2013 – Nov 2023" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: customEase } }
};

export default function Cast() {
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnimeStaff().then(d => {
      setStaffData(d.data.slice(0, 12));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleImgError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/200x280/141414/8a0303?text=NO+IMAGE';
  };

  return (
    <motion.div className="cast-page page-container container"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}>

      {/* ── TITLE ─────────────────────────────────────── */}
      <motion.div className="cast-page-header"
        initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: customEase }}>
        <span className="section-eyebrow">THE PEOPLE BEHIND THE STORY</span>
        <h1 className="page-title text-blood">CAST & PRODUCTION</h1>
      </motion.div>

      {/* ── PRODUCTION INFO ──────────────────────────── */}
      <motion.section className="production-band"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }} transition={{ duration: 0.9, ease: customEase }}>
        <h2 className="cast-section-title">PRODUCTION INFO</h2>
        <div className="production-grid">
          {PRODUCTION_INFO.map((item, i) => (
            <motion.div key={i} className="production-row"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.6, ease: customEase }}>
              <span className="prod-label">{item.label}</span>
              <span className="prod-value">{item.value}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── MAIN VOICE CAST ─────────────────────────── */}
      <section className="voice-cast-section">
        <h2 className="cast-section-title">VOICE CAST</h2>
        <motion.div className="voice-cast-grid"
          variants={containerVariants} initial="hidden" whileInView="show"
          viewport={{ once: true }}>
          {MAIN_CAST.map((person, i) => (
            <motion.div key={i} className="cast-card" variants={itemVariants}
              whileHover={{ y: -8, boxShadow: '0 15px 40px rgba(138,3,3,0.4)', borderColor: 'var(--primary-dark)' }}>
              <div className="cast-card-img">
                <img src={person.img} alt={person.voice_jp} onError={handleImgError} loading="lazy" />
              </div>
              <div className="cast-card-body">
                <span className="cast-character">{person.character}</span>
                <h3 className="cast-name">{person.voice_jp}</h3>
                <span className="cast-en">EN: {person.voice_en}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── PRODUCTION STAFF ────────────────────────── */}
      {!loading && staffData.length > 0 && (
        <section className="staff-section">
          <h2 className="cast-section-title">PRODUCTION STAFF</h2>
          <motion.div className="staff-grid"
            variants={containerVariants} initial="hidden" whileInView="show"
            viewport={{ once: true }}>
            {staffData.map((s, i) => (
              <motion.div key={i} className="staff-card" variants={itemVariants}
                whileHover={{ y: -6 }}>
                <div className="staff-img">
                  <img src={s.person.images?.jpg?.image_url || ''} alt={s.person.name} onError={handleImgError} loading="lazy" />
                </div>
                <div className="staff-info">
                  <h4>{s.person.name}</h4>
                  <p>{s.positions.join(', ')}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}
    </motion.div>
  );
}
