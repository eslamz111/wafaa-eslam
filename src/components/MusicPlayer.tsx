import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play, Volume2, Music } from "lucide-react";

interface MusicPlayerProps {
    audioUrl?: string;
    songTitle?: string;
    autoPlay?: boolean;
}

const MusicPlayer = ({ audioUrl, songTitle = "", autoPlay = false }: MusicPlayerProps) => {
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.4);
    const [visible, setVisible] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fadeInAudio = useCallback((audio: HTMLAudioElement) => {
        audio.volume = 0.05;
        audio.play().catch(() => { });
        setPlaying(true);

        let currentVol = 0.05;
        fadeIntervalRef.current = setInterval(() => {
            currentVol = Math.min(currentVol + 0.02, 0.4);
            audio.volume = currentVol;
            if (currentVol >= 0.4) {
                if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
            }
        }, 100);
    }, []);

    useEffect(() => {
        if (!audioUrl) return;

        const audio = new Audio(audioUrl);
        audio.loop = true;
        audio.volume = 0.4;
        audioRef.current = audio;

        if (autoPlay) {
            setVisible(true);
            setTimeout(() => fadeInAudio(audio), 500);
        }

        return () => {
            if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
            audio.pause();
            audio.src = "";
        };
    }, [audioUrl, autoPlay, fadeInAudio]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (playing) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(() => { });
        }
        setPlaying(!playing);
    };

    if (!visible || !audioUrl) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="mt-8 mx-auto flex items-center gap-3 px-5 py-3 rounded-2xl bg-card/80 backdrop-blur-md border border-border/50 shadow-2xl max-w-fit"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 1, ease: "easeOut" }}
                style={{ boxShadow: "0 0 30px hsl(340 65% 55% / 0.2)" }}
            >
                <button
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full romantic-gradient flex items-center justify-center text-primary-foreground shrink-0 hover:scale-105 transition-transform"
                >
                    {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>

                <div className="text-right min-w-0">
                    <p className="font-body text-sm text-foreground truncate max-w-[140px]">{songTitle}</p>
                    <p className="font-body text-xs text-muted-foreground">
                        {playing ? "بتشتغل دلوقتي 🎵" : "متوقفة"}
                    </p>
                </div>

                <div className="flex items-center gap-2 mr-2">
                    <Volume2 className="w-4 h-4 text-muted-foreground shrink-0" />
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-20 h-1 accent-primary cursor-pointer"
                    />
                </div>

                <Music className="w-4 h-4 text-primary/40 shrink-0" />
            </motion.div>
        </AnimatePresence>
    );
};

export default MusicPlayer;
