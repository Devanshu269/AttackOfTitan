import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Characters.css';

const customEase = [0.76, 0, 0.24, 1];

// ✅ Hardcoded verified MAL CDN images — CORS open, no proxy needed
// Fetched from api.jikan.moe/v4/anime/16498/characters
const CHARACTERS = [
  { id: 40882, name: "Eren Yeager",      species: "Human / Titan Shifter", status: "Deceased", occupation: "Scout Regiment",     img: "https://cdn.myanimelist.net/images/characters/10/216895.jpg?s=ccb6539cbfc5462df97d61a48c52af93", gender: "Male",   affiliation: "Eldian" },
  { id: 40881, name: "Mikasa Ackermann",  species: "Human (Ackerman)",      status: "Alive",    occupation: "Scout Regiment",     img: "https://cdn.myanimelist.net/images/characters/9/215563.jpg?s=5b0650bb09a7e053afc6bad84ab48947",  gender: "Female", affiliation: "Eldian" },
  { id: 46494, name: "Armin Arlelt",     species: "Human / Titan Shifter", status: "Alive",    occupation: "Scout Regiment",     img: "https://cdn.myanimelist.net/images/characters/8/220267.jpg?s=afa2751e2201aba1f5179544e787ba1a",  gender: "Male",   affiliation: "Eldian" },
  { id: 45627, name: "Levi Ackermann",              species: "Human (Ackerman)",      status: "Alive",    occupation: "Scout Regiment",     img: "https://cdn.myanimelist.net/images/characters/2/241413.jpg?s=1a789f9d4c7a441881e4b06a75bd91db",  gender: "Male",   affiliation: "Eldian" },
  { id: 71121, name: "Hange Zoë",        species: "Human",                 status: "Deceased", occupation: "Scout Regiment",     img: "https://cdn.myanimelist.net/images/characters/15/208637.jpg?s=3cfdcb5ec72bf4fbd01291026f8c955c", gender: "Unknown",affiliation: "Eldian" },
  { id: 46496, name: "Erwin Smith",      species: "Human",                 status: "Deceased", occupation: "Scout Regiment",     img: "https://cdn.myanimelist.net/images/characters/14/559023.jpg?s=148a0689d341e23cae536207d030f3fc", gender: "Male",   affiliation: "Eldian" },
  { id: 46484, name: "Reiner Braun",     species: "Human / Titan Shifter", status: "Alive",    occupation: "Warrior Unit",       img: "https://cdn.myanimelist.net/images/characters/16/206489.jpg?s=e48695a419dc6e71c831d7481a5fc86f", gender: "Male",   affiliation: "Marleyan" },
  { id: 46490, name: "Annie Leonhart",   species: "Human / Titan Shifter", status: "Alive",    occupation: "Military Police",    img: "https://cdn.myanimelist.net/images/characters/9/206357.jpg?s=3a853fc7177a3eeaefbecb530d590a4a",  gender: "Female", affiliation: "Marleyan" },
  { id: 46486, name: "Bertholdt Hoover", species: "Human / Titan Shifter", status: "Deceased", occupation: "Warrior Unit",       img: "https://cdn.myanimelist.net/images/characters/3/206343.jpg?s=b5bb0e73c60d50fc8c2e20d0c7c03f5b",  gender: "Male",   affiliation: "Marleyan" },
  { id: 46492, name: "Zeke Yeager",      species: "Human / Titan Shifter", status: "Deceased", occupation: "Warrior Commander",  img: "https://cdn.myanimelist.net/images/characters/10/329199.jpg?s=4ebc7fd5cc01a8c6c3f15c6fe24e20c8", gender: "Male",   affiliation: "Marleyan" },
  { id: 144858,name: "Gabi Braun",       species: "Human",                 status: "Alive",    occupation: "Warrior Candidate",  img: "https://cdn.myanimelist.net/images/characters/8/399580.jpg?s=9da5be2551a4e2b2a56e13c35c84a2e6",  gender: "Female", affiliation: "Marleyan" },
  { id: 144860,name: "Falco Grice",      species: "Human / Titan Shifter", status: "Alive",    occupation: "Warrior Candidate",  img: "https://cdn.myanimelist.net/images/characters/16/399578.jpg?s=5e3c8e2cd09e42c7df2b2ef04daf6285", gender: "Male",   affiliation: "Marleyan" },
  { id: 46488, name: "Sasha Braus",      species: "Human",                 status: "Deceased", occupation: "Scout Regiment",     img: "https://cdn.myanimelist.net/images/characters/4/206477.jpg?s=aef93f71f08e0c1d2b19f7b9ea4eb8d6",  gender: "Female", affiliation: "Eldian" },
  { id: 46500, name: "Connie Springer",  species: "Human",                 status: "Alive",    occupation: "Scout Regiment",     img: "https://cdn.myanimelist.net/images/characters/9/206449.jpg?s=0f70b2a49d6c4f55c6abc73f0ef41720",  gender: "Male",   affiliation: "Eldian" },
  { id: 46502, name: "Petra Ral",        species: "Human",                 status: "Deceased", occupation: "Scout Regiment",     img: "https://cdn.myanimelist.net/images/characters/7/206455.jpg?s=c8eb4a0e4b5d0ca7a18af3fd7e58e50c",  gender: "Female", affiliation: "Eldian" },
  { id: 46498, name: "Jean Kirstein",    species: "Human",                 status: "Alive",    occupation: "Scout Regiment",     img: "https://cdn.myanimelist.net/images/characters/2/206413.jpg?s=0b76d7e7b7d9a5b8d3d0c0baa5aef2c2",  gender: "Male",   affiliation: "Eldian" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 50, rotateX: -15 },
  show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.7, ease: customEase } }
};

export default function Characters() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const filters = ['ALL', 'ELDIAN', 'MARLEYAN'];
  const filtered = filter === 'ALL'
    ? CHARACTERS
    : CHARACTERS.filter(c => c.affiliation?.toUpperCase() === filter);

  const handleImgError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/300x400/141414/8a0303?text=CLASSIFIED';
  };

  return (
    <motion.div className="page-container container"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}>

      {/* Header */}
      <motion.div className="chars-header"
        initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: customEase }}>
        <span className="section-eyebrow">SCOUT REGIMENT FILES</span>
        <h1 className="page-title text-blood">PERSONNEL RECORDS</h1>
      </motion.div>

      {/* Filter tabs */}
      <div className="filter-tabs">
        {filters.map(f => (
          <button key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div className="characters-grid"
        variants={containerVariants} initial="hidden" animate="show">
        {filtered.map((char) => (
          <motion.div key={char.id} className="character-card glass-panel card"
            variants={itemVariants}
            whileHover={{ y: -10, scale: 1.03, boxShadow: "0 20px 40px rgba(138,3,3,0.5)" }}
            onClick={() => setSelected(char)}>
            <div className="char-img-container">
              <img src={char.img} alt={char.name} onError={handleImgError} loading="lazy" />
            </div>
            <div className="char-info-short">
              <h3>{char.name}</h3>
              <p>{char.species}</p>
              <span className={`status-badge ${char.status === 'Alive' ? 'alive' : 'dead'}`}>
                {char.status}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div className="modal-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}>
            <motion.div className="modal-content glass-panel"
              initial={{ scale: 0.85, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 40 }}
              transition={{ duration: 0.5, ease: customEase }}
              onClick={e => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setSelected(null)}>×</button>
              <div className="modal-inner">
                <img src={selected.img} alt={selected.name} onError={handleImgError} />
                <div className="modal-details">
                  <h2>{selected.name}</h2>
                  <div className="detail-grid">
                    <div><strong>Species:</strong> {selected.species}</div>
                    <div><strong>Gender:</strong> {selected.gender}</div>
                    <div><strong>Occupation:</strong> {selected.occupation}</div>
                    <div><strong>Affiliation:</strong> {selected.affiliation}</div>
                    <div>
                      <strong>Status:</strong>{' '}
                      <span className={selected.status === 'Alive' ? 'status-alive' : 'status-dead'}>
                        {selected.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
