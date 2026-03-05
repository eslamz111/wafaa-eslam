import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, LogIn, Lock } from "lucide-react";

const ADMIN_PASSWORD = "123456789";

const AdminLogin = () => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Small delay for UX feel
        await new Promise((r) => setTimeout(r, 400));

        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem("admin_auth", "true");
            navigate("/admin", { replace: true });
        } else {
            setError("كلمة السر غلط! حاول تاني 🔒");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-soft via-background to-gold-light p-4">
            <motion.div
                className="romantic-card max-w-md w-full p-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="text-center mb-8">
                    <Heart className="w-12 h-12 text-primary mx-auto mb-4 heartbeat" fill="currentColor" />
                    <h1 className="font-display text-3xl text-primary mb-2">لوحة التحكم ❤️</h1>
                    <p className="font-body text-muted-foreground">دخّل كلمة السر عشان تتحكم في الموقع</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="font-body text-sm text-foreground/70 block mb-2">كلمة السر</label>
                        <div className="relative">
                            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pr-11 pl-4 py-3 rounded-xl bg-background border border-border font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                                placeholder="••••••••"
                                required
                                dir="ltr"
                                autoFocus
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.p
                            className="text-destructive font-body text-sm text-center"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {error}
                        </motion.p>
                    )}

                    <motion.button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl romantic-gradient text-primary-foreground font-body text-lg flex items-center justify-center gap-2 disabled:opacity-60"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading ? (
                            <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                            <>
                                <LogIn className="w-5 h-5" />
                                دخول
                            </>
                        )}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
