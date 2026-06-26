import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchAnimeStaff } from '../services/api';
import './Staff.css';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnimeStaff()
      .then(data => {
        setStaff(data.data.slice(0, 20));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleImageError = (e) => {
    e.target.onerror = null; 
    e.target.src = 'https://via.placeholder.com/300x400/141414/8a0303?text=NO+DATA';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateZ: -5 },
    show: { opacity: 1, scale: 1, rotateZ: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div 
      className="page-container container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h1 
        className="page-title text-blood"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        PRODUCTION STAFF
      </motion.h1>
      
      {loading ? (
        <div className="mini-loader text-blood">Recruiting personnel...</div>
      ) : (
        <motion.div 
          className="staff-grid"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {staff.map((person) => (
            <motion.div 
              key={person.person.mal_id} 
              className="staff-card glass-panel"
              variants={itemVariants}
            >
              <div className="staff-img-container">
                <img src={person.person.images?.jpg?.image_url || 'https://via.placeholder.com/200'} alt={person.person.name} onError={handleImageError} loading="lazy" />
              </div>
              <div className="staff-info">
                <h3>{person.person.name}</h3>
                <p>{person.positions.join(', ')}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Staff;
