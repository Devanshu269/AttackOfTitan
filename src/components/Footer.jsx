import React from 'react';
import { NavLink } from 'react-router-dom';
import { Github, Twitter, Instagram } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        
        <div className="footer-brand">
          <h2 className="footer-title">ATTACK<br/><span className="text-red">ON TITAN</span></h2>
          <p className="footer-desc">
            "Dedicate your heart." A tribute to one of the greatest anime series of all time. Explore the lore, the characters, and the epic journey beyond the walls.
          </p>
        </div>
        
        <div className="footer-links">
          <h3 className="footer-subtitle">NAVIGATION</h3>
          <ul>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/episodes">Episodes</NavLink></li>
            <li><NavLink to="/characters">Characters</NavLink></li>
            <li><NavLink to="/titans">Titans</NavLink></li>
            <li><NavLink to="/cast">Cast</NavLink></li>
          </ul>
        </div>
        
        <div className="footer-social">
          <h3 className="footer-subtitle">CONNECT</h3>
          <div className="social-icons">
            <a href="#" target="_blank" rel="noreferrer" title="GitHub"><Github size={20} /></a>
            <a href="#" target="_blank" rel="noreferrer" title="Twitter"><Twitter size={20} /></a>
            <a href="#" target="_blank" rel="noreferrer" title="Instagram"><Instagram size={20} /></a>
          </div>
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} Shingeki no Kyojin Fan Portal.<br/>
            Created for educational & fandom purposes.<br/>
            All rights belong to Hajime Isayama and Kodansha.
          </div>
        </div>

      </div>
    </footer>
  );
}
