import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchAnimeEpisodes } from '../services/api';
import { Star } from 'lucide-react';
import './Episodes.css';

const SEASONS = [
  { id: 16498, name: "Season 1" },
  { id: 25777, name: "Season 2" },
  { id: 35760, name: "Season 3 Part 1" },
  { id: 38524, name: "Season 3 Part 2" },
  { id: 40028, name: "The Final Season Part 1" },
  { id: 48583, name: "The Final Season Part 2" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -50, skewX: -10 },
  show: { opacity: 1, x: 0, skewX: 0, transition: { type: "spring", stiffness: 80, damping: 12 } }
};

const Episodes = () => {
  const [selectedSeason, setSelectedSeason] = useState(SEASONS[0]);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch episodes. Note: pagination might be needed for S1 since it has 25 eps (Jikan usually limits to 100 per page so 1 page is enough for AoT seasons)
    fetchAnimeEpisodes(selectedSeason.id)
      .then(data => {
        setEpisodes(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedSeason]);

  return (
    <motion.div 
      className="page-container container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="page-title text-gradient">Episodes & Ratings</h1>
      
      <div className="season-selector">
        {SEASONS.map((season) => (
          <button 
            key={season.id}
            className={`season-btn ${selectedSeason.id === season.id ? 'active' : ''}`}
            onClick={() => setSelectedSeason(season)}
          >
            {season.name}
          </button>
        ))}
      </div>

      <div className="season-stats glass-panel">
        <h2>{selectedSeason.name} Overview</h2>
        <p>Total Episodes: {episodes.length}</p>
      </div>

      {loading ? (
        <div className="mini-loader text-blood">Intercepting transmissions...</div>
      ) : (
        <motion.div 
          className="episodes-list"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {episodes.map((ep) => (
            <motion.div 
              key={ep.mal_id} 
              className="episode-card glass-panel"
              variants={itemVariants}
              whileHover={{ scale: 1.02, x: 10, backgroundColor: "rgba(30, 10, 10, 0.9)" }}
            >
              <div className="ep-number">EP {ep.mal_id}</div>
              <div className="ep-info">
                <h3>{ep.title}</h3>
                <p className="ep-title-romanji">{ep.title_romanji}</p>
                {ep.aired && <p className="ep-aired">Aired: {new Date(ep.aired).toLocaleDateString()}</p>}
              </div>
              <div className="ep-rating">
                <Star className="star-icon" fill="var(--primary-color)" color="var(--primary-color)" />
                <span>{ep.score ? ep.score : 'N/A'}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Episodes;
