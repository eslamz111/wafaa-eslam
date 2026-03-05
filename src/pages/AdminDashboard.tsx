import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Heart,
    Settings,
    Image,
    Video,
    Clock,
    Gift,
    MessageCircle,
    HelpCircle,
    Sparkles,
    Music,
    Lock,
    LogOut,
    Menu,
    X,
} from "lucide-react";

import SettingsSection from "@/components/admin/sections/SettingsSection";
import GallerySection from "@/components/admin/sections/GallerySection";
import VideosSection from "@/components/admin/sections/VideosSection";
import TimelineSection from "@/components/admin/sections/TimelineSection";
import PromisesSection from "@/components/admin/sections/PromisesSection";
import LoveNotesSection from "@/components/admin/sections/LoveNotesSection";
import WhyILoveYouSection from "@/components/admin/sections/WhyILoveYouSection";
import DreamsSection from "@/components/admin/sections/DreamsSection";
import SongsSection from "@/components/admin/sections/SongsSection";
import SecretMessageSection from "@/components/admin/sections/SecretMessageSection";

const navItems = [
    { key: "settings", label: "الإعدادات", icon: Settings },
    { key: "gallery", label: "الصور", icon: Image },
    { key: "videos", label: "الفيديوهات", icon: Video },
    { key: "timeline", label: "التايم لاين", icon: Clock },
    { key: "promises", label: "الوعود", icon: Gift },
    { key: "loveNotes", label: "رسائل الحب", icon: MessageCircle },
    { key: "whyILoveYou", label: "ليه بحبك", icon: HelpCircle },
    { key: "dreams", label: "المستقبل", icon: Sparkles },
    { key: "songs", label: "الأغاني", icon: Music },
    { key: "secret", label: "الرسالة السرية", icon: Lock },
];

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState("settings");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem("admin_auth");
        navigate("/admin/login");
    };

    const renderSection = () => {
        switch (activeSection) {
            case "settings": return <SettingsSection />;
            case "gallery": return <GallerySection />;
            case "videos": return <VideosSection />;
            case "timeline": return <TimelineSection />;
            case "promises": return <PromisesSection />;
            case "loveNotes": return <LoveNotesSection />;
            case "whyILoveYou": return <WhyILoveYouSection />;
            case "dreams": return <DreamsSection />;
            case "songs": return <SongsSection />;
            case "secret": return <SecretMessageSection />;
            default: return <SettingsSection />;
        }
    };

    return (
        <div className="min-h-screen bg-background flex" dir="rtl">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-foreground/30 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed md:static inset-y-0 right-0 z-40 w-64 bg-card border-l border-border shadow-lg transform transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
                    } flex flex-col`}
            >
                {/* Logo */}
                <div className="p-5 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Heart className="w-6 h-6 text-primary" fill="currentColor" />
                        <span className="font-display text-xl text-primary">لوحة التحكم</span>
                    </div>
                    <button
                        className="md:hidden text-muted-foreground"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav items */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.key;
                        return (
                            <button
                                key={item.key}
                                onClick={() => {
                                    setActiveSection(item.key);
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm transition-all ${isActive
                                    ? "bg-primary/10 text-primary font-bold shadow-sm"
                                    : "text-foreground/70 hover:bg-secondary hover:text-foreground"
                                    }`}
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-3 border-t border-border">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        تسجيل خروج
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 min-h-screen">
                {/* Top bar */}
                <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
                    <button
                        className="md:hidden text-foreground"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <h2 className="font-display text-xl text-primary">
                        {navItems.find((i) => i.key === activeSection)?.label || "الإعدادات"}
                    </h2>
                </div>

                {/* Content */}
                <motion.div
                    key={activeSection}
                    className="p-4 sm:p-6 max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderSection()}
                </motion.div>
            </main>
        </div>
    );
};

export default AdminDashboard;
