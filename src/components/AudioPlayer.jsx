import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, SkipBack, SkipForward, Play, Pause, Music, ChevronUp, ChevronDown } from 'lucide-react';
import './AudioPlayer.css';

/**
 * Multi-track AoT music player.
 *
 * WHY THIS APPROACH WORKS:
 * - Browser autoplay policy: audio/video can only start if triggered by a user gesture.
 * - Setting iframe.src SYNCHRONOUSLY inside a click handler IS a user gesture action.
 * - The iframe must be IN-VIEWPORT (not display:none, not opacity:0, not off-screen).
 * - We use top:0; left:0; width:1px; height:1px; opacity:0.01 — tiny but in-viewport.
 *
 * Using `8OkpRK2_gVs` (Guren no Yumiya Opening 1) as first track — confirmed embeddable.
 */

const AOT_TRACKS = [
  { title: "Guren no Yumiya", artist: "Linked Horizon", videoId: "8OkpRK2_gVs" },
  { title: "Shinzou wo Sasageyo!", artist: "Linked Horizon", videoId: "LKP-vZvjbh8" },
  { title: "Jiyuu no Tsubasa", artist: "Linked Horizon", videoId: "PbWFpzi8C94" },
  { title: "My War (Boku no Sensou)", artist: "Shinsei Kamattechan", videoId: "LV9CFlkEy1I" },
  { title: "The Rumbling", artist: "SiM", videoId: "9l9Wa-5ph6o" },
  { title: "Attack On Titan OST Mix", artist: "Hiroyuki Sawano", videoId: "MGRm4IzK1SQ" },
  { title: "All Openings & Endings", artist: "Various Artists", videoId: "uF0u7C5zWwQ" },
];

const buildSrc = (videoId, play) =>
  `https://www.youtube.com/embed/${videoId}?autoplay=${play ? 1 : 0}&mute=0&loop=1&playlist=${videoId}&controls=0&enablejsapi=1&rel=0&modestbranding=1`;

export default function AudioPlayer() {
  const [trackIdx, setTrackIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const iframeRef = useRef(null);

  const track = AOT_TRACKS[trackIdx];

  /** Load a track. MUST be called synchronously inside a click handler. */
  const loadTrack = (idx, autoplay) => {
    if (iframeRef.current) {
      iframeRef.current.src = buildSrc(AOT_TRACKS[idx].videoId, autoplay);
    }
  };

  const togglePlay = () => {
    if (!playing) {
      loadTrack(trackIdx, true);   // User gesture → autoplay allowed
      setPlaying(true);
    } else {
      // Pause via YouTube postMessage command
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*'
      );
      setPlaying(false);
    }
  };

  const nextTrack = () => {
    const next = (trackIdx + 1) % AOT_TRACKS.length;
    setTrackIdx(next);
    loadTrack(next, playing);  // Continue if already playing
  };

  const prevTrack = () => {
    const prev = (trackIdx - 1 + AOT_TRACKS.length) % AOT_TRACKS.length;
    setTrackIdx(prev);
    loadTrack(prev, playing);
  };

  const selectTrack = (i) => {
    setTrackIdx(i);
    loadTrack(i, true);
    setPlaying(true);
  };

  return (
    <div className={`audio-player-wrap ${expanded ? 'expanded' : ''}`}>

      {/*
        ── CRITICAL: iframe must be in-viewport for autoplay to work.
        top:0; left:0; 1px×1px; opacity:0.01 = "visible" to browser policy
        but invisible to human eyes. src is set only on user click.
      */}
      <iframe
        ref={iframeRef}
        title="aot-audio"
        allow="autoplay; encrypted-media"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '1px',
          height: '1px',
          opacity: 0.01,
          pointerEvents: 'none',
          zIndex: -1,
          border: 'none',
        }}
      />

      {/* ── Compact player bar ── */}
      <div className="audio-bar">

        {/* Expand toggle */}
        <button className="audio-expand-btn" onClick={() => setExpanded(e => !e)} title="Tracklist">
          {expanded ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
        </button>

        {/* Prev */}
        <button className="audio-ctrl-btn" onClick={prevTrack} title="Previous">
          <SkipBack size={15} />
        </button>

        {/* Play / Pause */}
        <button className="audio-play-btn" onClick={togglePlay} title={playing ? "Pause" : "Play"}>
          <AnimatePresence mode="wait" initial={false}>
            {playing ? (
              <motion.span key="pause"
                initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                <Pause size={17} />
              </motion.span>
            ) : (
              <motion.span key="play"
                initial={{ scale: 0, rotate: 90 }} animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -90 }} transition={{ duration: 0.2 }}>
                <Play size={17} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Next */}
        <button className="audio-ctrl-btn" onClick={nextTrack} title="Next">
          <SkipForward size={15} />
        </button>

        {/* Track info */}
        <div className="audio-track-info">
          <AnimatePresence mode="wait">
            <motion.span key={`title-${trackIdx}`} className="audio-track-name"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35 }}>
              {playing ? track.title : "CLICK ▶ TO PLAY"}
            </motion.span>
          </AnimatePresence>
          <span className="audio-track-artist">{playing ? track.artist : "AoT SOUNDTRACK"}</span>
        </div>

        {/* Equalizer animation */}
        {playing && (
          <div className="eq-bars">
            {[0.7, 1.0, 0.5, 0.85].map((h, i) => (
              <motion.span key={i} className="eq-bar"
                animate={{ scaleY: [h * 0.4, h, h * 0.6, h * 0.9, h * 0.3] }}
                transition={{ repeat: Infinity, duration: 0.55 + i * 0.14, ease: "easeInOut" }} />
            ))}
          </div>
        )}
      </div>

      {/* ── Track list (expanded) ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div className="audio-tracklist"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}>

            <div className="tracklist-header">
              <Music size={11} />
              <span>TRACKLIST — SHINGEKI NO KYOJIN</span>
            </div>

            {AOT_TRACKS.map((t, i) => (
              <button key={i}
                className={`tracklist-item ${i === trackIdx ? 'active' : ''}`}
                onClick={() => selectTrack(i)}>
                <span className="tl-num">{String(i + 1).padStart(2, '0')}</span>
                <div className="tl-info">
                  <span className="tl-title">{t.title}</span>
                  <span className="tl-artist">{t.artist}</span>
                </div>
                {i === trackIdx && playing && (
                  <div className="eq-bars sm">
                    {[1, 2, 3].map(j => (
                      <motion.span key={j} className="eq-bar"
                        animate={{ scaleY: [0.3, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 0.5 + j * 0.15 }} />
                    ))}
                  </div>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
