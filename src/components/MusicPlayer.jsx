import { useState, useRef, useEffect } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Volume2, VolumeX, Heart, Music2 } from "lucide-react";
import * as Slider from '@radix-ui/react-slider';
import { motion, AnimatePresence } from "framer-motion";

// Floating hearts background particles
const FloatingHeart = ({ style }) => (
    <motion.div
        className="absolute pointer-events-none select-none"
        style={style}
        animate={{
            y: [-10, -40, -10],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5],
        }}
        transition={{
            duration: style.duration,
            repeat: Infinity,
            delay: style.delay,
            ease: "easeInOut",
        }}
    >
        <Heart className="fill-rose-400 text-rose-400" style={{ width: style.size, height: style.size }} />
    </motion.div>
);

const hearts = Array.from({ length: 6 }, (_, i) => ({
    left: `${10 + i * 15}%`,
    bottom: "10%",
    size: 8 + (i % 3) * 4,
    duration: 2.5 + i * 0.4,
    delay: i * 0.5,
    opacity: 0,
}));

// Animated sound wave bars
const SoundWave = ({ isPlaying }) => (
    <div className="flex items-end gap-[3px] h-5">
        {[0.6, 1, 0.7, 0.9, 0.5, 0.8, 0.6].map((h, i) => (
            <motion.div
                key={i}
                className="w-[3px] rounded-full"
                style={{
                    background: "linear-gradient(to top, #f43f5e, #fb7185)",
                    height: isPlaying ? undefined : `${h * 8}px`,
                    opacity: isPlaying ? 1 : 0.4,
                }}
                animate={isPlaying ? {
                    height: [`${h * 6}px`, `${h * 18}px`, `${h * 6}px`],
                } : { height: `${h * 8}px` }}
                transition={{
                    duration: 0.6 + i * 0.1,
                    repeat: Infinity,
                    delay: i * 0.08,
                    ease: "easeInOut",
                }}
            />
        ))}
    </div>
);

const MusicPlayer = ({ audioUrl, songTitle, autoPlay = false }) => {
    const playerRef = useRef(null);
    const [volume, setVolume] = useState(0.4);
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const [heartBeat, setHeartBeat] = useState(false);

    useEffect(() => {
        if (playerRef.current?.audio?.current) {
            playerRef.current.audio.current.volume = volume;
            playerRef.current.audio.current.muted = isMuted;
        }
    }, [volume, isMuted]);

    useEffect(() => {
        if (isPlaying) {
            const interval = setInterval(() => {
                setHeartBeat(v => !v);
            }, 800);
            return () => clearInterval(interval);
        }
    }, [isPlaying]);

    if (!audioUrl) return null;

    const handleVolumeChange = (value) => {
        setVolume(value[0]);
        if (value[0] > 0 && isMuted) setIsMuted(false);
    };

    return (
        <>
            {/* Inject styles */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&family=Playfair+Display:ital@0;1&display=swap');

        .love-player-wrap * { font-family: 'Tajawal', sans-serif; }

        .love-player-wrap .audio-inner .rhap_container {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .love-player-wrap .rhap_progress-section { margin-bottom: 4px; }
        .love-player-wrap .rhap_progress-bar {
          height: 4px;
          border-radius: 99px;
          background: rgba(244,63,94,0.15);
          overflow: visible;
        }
        .love-player-wrap .rhap_progress-filled {
          background: linear-gradient(90deg, #f43f5e, #fb923c);
          border-radius: 99px;
        }
        .love-player-wrap .rhap_progress-indicator {
          width: 14px;
          height: 14px;
          top: -5px;
          background: white;
          box-shadow: 0 0 0 3px #f43f5e, 0 2px 8px rgba(244,63,94,0.4);
          border: none;
          transition: transform 0.15s;
        }
        .love-player-wrap .rhap_progress-indicator:hover { transform: scale(1.3); }
        .love-player-wrap .rhap_time {
          color: rgba(244,63,94,0.7);
          font-size: 0.7rem;
          font-family: 'Tajawal', sans-serif !important;
          font-weight: 500;
        }
        .love-player-wrap .rhap_main-controls-button {
          color: #f43f5e;
          transition: all 0.2s;
        }
        .love-player-wrap .rhap_main-controls-button:hover {
          color: #e11d48;
          transform: scale(1.1);
        }
        .love-player-wrap .rhap_play-pause-button {
          font-size: 0;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f43f5e 0%, #fb7185 100%);
          border-radius: 50%;
          box-shadow: 0 4px 20px rgba(244,63,94,0.45);
          color: white !important;
          transition: all 0.25s !important;
        }
        .love-player-wrap .rhap_play-pause-button:hover {
          transform: scale(1.08) !important;
          box-shadow: 0 6px 28px rgba(244,63,94,0.6) !important;
        }
        .love-player-wrap .rhap_play-pause-button svg {
          width: 22px;
          height: 22px;
          color: white;
          fill: white;
        }
        .love-player-wrap .rhap_controls-section { margin-top: 0; justify-content: center; }
        .love-player-wrap .rhap_stacked .rhap_controls-section { margin-top: 4px; }
        .love-player-wrap .rhap_volume-controls { display: none; }
        .love-player-wrap .rhap_additional-controls { display: none; }

        @keyframes rotate-disc {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .disc-spin { animation: rotate-disc 6s linear infinite; }
        .disc-paused { animation-play-state: paused; }

        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .pulse-ring {
          animation: pulse-ring 1.6s ease-out infinite;
        }
      `}</style>

            <div
                dir="rtl"
                className="love-player-wrap relative w-full max-w-md mx-auto mt-6"
            >
                {/* Outer glow */}
                <div
                    className="absolute inset-0 rounded-3xl opacity-60 blur-2xl"
                    style={{
                        background: isPlaying
                            ? "radial-gradient(ellipse at center, rgba(244,63,94,0.25) 0%, transparent 70%)"
                            : "radial-gradient(ellipse at center, rgba(244,63,94,0.1) 0%, transparent 70%)",
                        transition: "background 1s ease",
                    }}
                />

                {/* Card */}
                <div
                    className="relative overflow-hidden rounded-3xl"
                    style={{
                        background: "linear-gradient(145deg, rgba(255,240,245,0.97) 0%, rgba(255,255,255,0.99) 50%, rgba(255,236,241,0.97) 100%)",
                        boxShadow: "0 20px 60px rgba(244,63,94,0.18), 0 4px 16px rgba(244,63,94,0.1), inset 0 1px 0 rgba(255,255,255,0.9)",
                        border: "1px solid rgba(244,63,94,0.12)",
                    }}
                >
                    {/* Decorative top ribbon */}
                    <div
                        className="absolute top-0 left-0 right-0 h-1"
                        style={{ background: "linear-gradient(90deg, #f43f5e, #fb923c, #f43f5e)" }}
                    />

                    {/* Subtle pattern */}
                    <div
                        className="absolute inset-0 opacity-[0.025] pointer-events-none"
                        style={{
                            backgroundImage: `radial-gradient(circle, #f43f5e 1px, transparent 1px)`,
                            backgroundSize: "24px 24px",
                        }}
                    />

                    {/* Floating hearts */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {hearts.map((h, i) => (
                            <FloatingHeart key={i} style={{ ...h, animationPlayState: isPlaying ? "running" : "paused" }} />
                        ))}
                    </div>

                    <div className="relative z-10 p-4">
                        {/* Top row: disc + info */}
                        <div className="flex items-center gap-4 mb-3">

                            {/* Vinyl disc */}
                            <div className="relative shrink-0 w-14 h-14">
                                {/* Pulse rings when playing */}
                                {isPlaying && (
                                    <>
                                        <div
                                            className="pulse-ring absolute inset-0 rounded-full border-2 border-rose-300"
                                            style={{ animationDelay: "0s" }}
                                        />
                                        <div
                                            className="pulse-ring absolute inset-0 rounded-full border-2 border-rose-200"
                                            style={{ animationDelay: "0.5s" }}
                                        />
                                    </>
                                )}
                                <div
                                    className={`w-14 h-14 rounded-full flex items-center justify-center ${isPlaying ? "disc-spin" : "disc-paused"}`}
                                    style={{
                                        background: "conic-gradient(from 0deg, #1a0a0f, #3d1520, #1a0a0f, #3d1520, #1a0a0f, #3d1520, #1a0a0f, #3d1520)",
                                        boxShadow: isPlaying
                                            ? "0 0 0 3px rgba(244,63,94,0.4), 0 8px 24px rgba(0,0,0,0.3)"
                                            : "0 4px 16px rgba(0,0,0,0.2)",
                                        transition: "box-shadow 0.5s ease",
                                    }}
                                >
                                    {/* Grooves */}
                                    {[20, 26, 32, 38, 44].map(size => (
                                        <div
                                            key={size}
                                            className="absolute rounded-full border border-white/5"
                                            style={{ width: size, height: size }}
                                        />
                                    ))}
                                    {/* Center label */}
                                    <div
                                        className="w-7 h-7 rounded-full flex items-center justify-center z-10"
                                        style={{
                                            background: "linear-gradient(135deg, #f43f5e, #fb7185)",
                                            boxShadow: "0 2px 8px rgba(244,63,94,0.5)",
                                        }}
                                    >
                                        <Heart
                                            className="fill-white text-white"
                                            style={{
                                                width: 11,
                                                height: 11,
                                                transform: isPlaying ? "scale(1.15)" : "scale(1)",
                                                transition: "transform 0.3s ease",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Title + wave */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span
                                        className="text-xs font-medium tracking-widest uppercase"
                                        style={{ color: "rgba(244,63,94,0.5)", letterSpacing: "0.15em" }}
                                    >
                                        ♥ تشغيل الآن
                                    </span>
                                </div>

                                {songTitle && (
                                    <h3
                                        className="font-bold text-base leading-tight mb-1 truncate"
                                        style={{
                                            color: "#1a0a0f",
                                            fontFamily: "'Tajawal', sans-serif",
                                            fontWeight: 700,
                                        }}
                                        title={songTitle}
                                    >
                                        {songTitle}
                                    </h3>
                                )}

                                <SoundWave isPlaying={isPlaying} />
                            </div>
                        </div>

                        {/* Audio player */}
                        <div className="audio-inner">
                            <AudioPlayer
                                ref={playerRef}
                                autoPlay={autoPlay}
                                src={audioUrl}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                showJumpControls={false}
                                customVolumeControls={[]}
                                customAdditionalControls={[]}
                                layout="stacked"
                            />
                        </div>

                        {/* Volume control - always visible */}
                        <div className="flex items-center justify-end mt-2 gap-2">
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 shrink-0"
                                style={{
                                    background: "rgba(244,63,94,0.08)",
                                    border: "1px solid rgba(244,63,94,0.15)",
                                    color: "#f43f5e",
                                }}
                            >
                                {isMuted || volume === 0
                                    ? <VolumeX size={15} />
                                    : <Volume2 size={15} />
                                }
                            </button>

                            <Slider.Root
                                className="relative flex items-center select-none touch-none h-5"
                                style={{ width: 90 }}
                                value={[isMuted ? 0 : volume]}
                                max={1}
                                step={0.01}
                                onValueChange={handleVolumeChange}
                            >
                                <Slider.Track
                                    className="relative grow rounded-full h-1.5"
                                    style={{ background: "rgba(244,63,94,0.15)" }}
                                >
                                    <Slider.Range
                                        className="absolute h-full rounded-full"
                                        style={{ background: "linear-gradient(90deg, #f43f5e, #fb7185)" }}
                                    />
                                </Slider.Track>
                                <Slider.Thumb
                                    className="block w-4 h-4 rounded-full focus:outline-none"
                                    style={{
                                        background: "white",
                                        border: "2px solid #f43f5e",
                                        boxShadow: "0 2px 8px rgba(244,63,94,0.3)",
                                    }}
                                    aria-label="Volume"
                                />
                            </Slider.Root>
                        </div>
                    </div>

                    {/* Bottom decorative bar */}
                    <div
                        className="h-0.5 opacity-20"
                        style={{ background: "linear-gradient(90deg, transparent, #f43f5e, transparent)" }}
                    />
                </div>
            </div>
        </>
    );
};

export default MusicPlayer;