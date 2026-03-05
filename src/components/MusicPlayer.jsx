import { useState, useRef, useEffect } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Volume2, VolumeX, Music } from "lucide-react";
import * as Slider from '@radix-ui/react-slider';
import { motion, AnimatePresence } from "framer-motion";

const MusicPlayer = ({ audioUrl, songTitle, autoPlay = false }) => {
    const playerRef = useRef(null);
    const [volume, setVolume] = useState(0.4);
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);

    useEffect(() => {
        if (playerRef.current?.audio?.current) {
            playerRef.current.audio.current.volume = volume;
            playerRef.current.audio.current.muted = isMuted;
        }
    }, [volume, isMuted]);

    if (!audioUrl) return null;

    const handleVolumeChange = (value) => {
        const newVolume = value[0];
        setVolume(newVolume);
        if (newVolume > 0 && isMuted) {
            setIsMuted(false);
        }
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    return (
        <div
            className="mt-8 mx-auto w-full max-w-xl group relative z-10"
        >
            {/* Ambient Base Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent blur-3xl rounded-3xl opacity-50 transition-opacity duration-1000 group-hover:opacity-80" />

            <div
                className="relative flex flex-col items-center justify-center p-6 rounded-[2rem] bg-card/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all duration-500 overflow-hidden"
                style={{
                    boxShadow: "0 0 40px hsl(var(--primary) / 0.15), inset 0 0 0 1px hsl(var(--primary) / 0.1)",
                }}
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />

                <div className="w-full flex items-center gap-5 relative z-10">
                    {/* Spinning Record / Disk Icon */}
                    <div className="relative shrink-0">
                        <div className={`w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 shadow-lg flex items-center justify-center bg-gradient-to-tr from-card to-secondary transition-transform duration-1000 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
                            <div className="absolute inset-0 romantic-gradient opacity-20" />
                            <Music className={`w-6 h-6 text-primary transition-transform duration-500 ${isPlaying ? 'scale-110' : 'scale-100'}`} />
                            {/* Record Center Hole */}
                            <div className="absolute w-4 h-4 bg-background rounded-full border border-primary/30 shadow-inner" />
                        </div>
                    </div>

                    {/* Info and Player */}
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                        {songTitle && (
                            <div className="flex items-center gap-2">
                                <motion.div
                                    initial={false}
                                    animate={{ opacity: isPlaying ? 1 : 0.7 }}
                                    className="font-display font-medium text-lg text-foreground truncate"
                                    title={songTitle}
                                >
                                    {songTitle}
                                </motion.div>
                                {isPlaying && (
                                    <div className="flex items-center gap-0.5 ml-1">
                                        {[1, 2, 3].map(i => (
                                            <motion.div
                                                key={i}
                                                className="w-1 bg-primary rounded-full"
                                                animate={{
                                                    height: [8, 16, 8],
                                                }}
                                                transition={{
                                                    duration: 0.8,
                                                    repeat: Infinity,
                                                    delay: i * 0.15,
                                                    ease: "easeInOut"
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="audio-player-wrapper w-full -mx-2">
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
                                className="!bg-transparent !shadow-none !p-0"
                            />
                        </div>
                    </div>

                    {/* Custom Integrated Volume Control */}
                    <div className="relative shrink-0 flex items-center justify-center ml-2">
                        <div
                            className="bg-background/80 hover:bg-background border border-primary/20 p-2.5 rounded-2xl shadow-sm transition-all duration-300 cursor-pointer group/volume flex items-center gap-2"
                            onMouseEnter={() => setShowVolumeSlider(true)}
                            onMouseLeave={() => setShowVolumeSlider(false)}
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleMute();
                                }}
                                className="text-primary hover:scale-110 transition-transform focus:outline-none"
                            >
                                {isMuted || volume === 0 ? (
                                    <VolumeX className="w-5 h-5" />
                                ) : (
                                    <Volume2 className="w-5 h-5" />
                                )}
                            </button>

                            <AnimatePresence>
                                {showVolumeSlider && (
                                    <motion.div
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 80, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden flex items-center px-1"
                                    >
                                        <Slider.Root
                                            className="relative flex items-center select-none touch-none w-full h-4"
                                            value={[isMuted ? 0 : volume]}
                                            max={1}
                                            step={0.01}
                                            onValueChange={handleVolumeChange}
                                        >
                                            <Slider.Track className="bg-primary/20 relative grow rounded-full h-1.5 overflow-hidden">
                                                <Slider.Range className="absolute bg-primary rounded-full h-full" />
                                            </Slider.Track>
                                            <Slider.Thumb
                                                className="block w-4 h-4 bg-background border-2 border-primary rounded-full shadow-[0_2px_10px] shadow-primary/30 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-transform"
                                                aria-label="Volume"
                                            />
                                        </Slider.Root>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global overrides for react-h5-audio-player specific to this instance */}
            <style jsx global>{`
                .audio-player-wrapper .rhap_container {
                    padding: 0 !important;
                }
                .audio-player-wrapper .rhap_progress-section {
                    margin-top: -6px;
                }
                .audio-player-wrapper .rhap_progress-bar {
                    height: 6px;
                    border-radius: 9999px;
                    background-color: hsl(var(--primary) / 0.15);
                }
                .audio-player-wrapper .rhap_progress-indicator {
                    background: hsl(var(--primary));
                    box-shadow: 0 0 10px hsl(var(--primary) / 0.5);
                    width: 14px;
                    height: 14px;
                    margin-top: -4px;
                    transition: transform 0.1s;
                }
                .audio-player-wrapper .rhap_progress-indicator:hover {
                    transform: scale(1.2);
                }
                .audio-player-wrapper .rhap_progress-filled {
                    background-color: hsl(var(--primary));
                    border-radius: 9999px;
                }
                .audio-player-wrapper .rhap_time {
                    color: hsl(var(--muted-foreground));
                    font-size: 0.75rem;
                    font-weight: 500;
                    font-family: inherit;
                }
                .audio-player-wrapper .rhap_main-controls-button {
                    color: hsl(var(--primary));
                    transition: all 0.2s ease;
                }
                .audio-player-wrapper .rhap_main-controls-button:hover {
                    color: hsl(var(--primary) / 0.8);
                    transform: scale(1.05);
                }
                .audio-player-wrapper .rhap_play-pause-button {
                    font-size: 40px;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    filter: drop-shadow(0 4px 6px hsl(var(--primary) / 0.2));
                }
                .audio-player-wrapper .rhap_controls-section {
                    margin-top: 4px;
                }
            `}</style>
        </div>
    );
};

export default MusicPlayer;
