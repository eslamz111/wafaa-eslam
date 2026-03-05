import { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Save, Heart } from "lucide-react";

const SettingsSection = () => {
    const [name1, setName1] = useState("إسلام");
    const [name2, setName2] = useState("وفاء");
    const [subtitle, setSubtitle] = useState("أهلاً يا وفا، دي صفحة ذكرياتنا الجميلة ❤️");
    const [tagline, setTagline] = useState("علاقة كلها حب وأمان حتى آخر العمر");
    const [anniversaryDate, setAnniversaryDate] = useState("2024-03-05");
    const [lockDay, setLockDay] = useState(5);
    const [lockMonth, setLockMonth] = useState(3);
    const [lockYear, setLockYear] = useState(2024);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const namesDoc = await getDoc(doc(db, "settings", "names"));
                if (namesDoc.exists()) {
                    const d = namesDoc.data();
                    setName1(d.name1 || "إسلام");
                    setName2(d.name2 || "وفاء");
                    setSubtitle(d.subtitle || "");
                    setTagline(d.tagline || "");
                }
                const annDoc = await getDoc(doc(db, "settings", "anniversaryDate"));
                if (annDoc.exists()) {
                    setAnniversaryDate(annDoc.data().anniversaryDate || "2024-03-05");
                }
                const lockDoc = await getDoc(doc(db, "settings", "lockPassword"));
                if (lockDoc.exists()) {
                    const d = lockDoc.data();
                    setLockDay(d.lockDay || 5);
                    setLockMonth(d.lockMonth || 3);
                    setLockYear(d.lockYear || 2024);
                }
            } catch (err) {
                console.error("Error loading settings:", err);
            }
        };
        loadSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, "settings", "names"), { name1, name2, subtitle, tagline });
            await setDoc(doc(db, "settings", "anniversaryDate"), { anniversaryDate });
            await setDoc(doc(db, "settings", "lockPassword"), { lockDay, lockMonth, lockYear });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            console.error("Error saving:", err);
            alert("حصل مشكلة في الحفظ!");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Names */}
            <div className="romantic-card p-6">
                <h3 className="font-display text-xl text-primary mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5" /> الأسماء
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="font-body text-sm text-foreground/70 block mb-1">الاسم الأول</label>
                        <input value={name1} onChange={(e) => setName1(e.target.value)} className="admin-input" />
                    </div>
                    <div>
                        <label className="font-body text-sm text-foreground/70 block mb-1">الاسم التاني</label>
                        <input value={name2} onChange={(e) => setName2(e.target.value)} className="admin-input" />
                    </div>
                </div>
                <div className="mt-4">
                    <label className="font-body text-sm text-foreground/70 block mb-1">النص التحتي</label>
                    <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="admin-input" />
                </div>
                <div className="mt-4">
                    <label className="font-body text-sm text-foreground/70 block mb-1">الشعار</label>
                    <input value={tagline} onChange={(e) => setTagline(e.target.value)} className="admin-input" />
                </div>
            </div>

            {/* Anniversary */}
            <div className="romantic-card p-6">
                <h3 className="font-display text-xl text-primary mb-4">📅 تاريخ الذكرى</h3>
                <input
                    type="date"
                    value={anniversaryDate}
                    onChange={(e) => setAnniversaryDate(e.target.value)}
                    className="admin-input"
                    dir="ltr"
                />
            </div>

            {/* Lock password */}
            <div className="romantic-card p-6">
                <h3 className="font-display text-xl text-primary mb-4">🔐 باسورد القفل</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="font-body text-sm text-foreground/70 block mb-1">اليوم</label>
                        <input type="number" min={1} max={31} value={lockDay} onChange={(e) => setLockDay(Number(e.target.value))} className="admin-input" dir="ltr" />
                    </div>
                    <div>
                        <label className="font-body text-sm text-foreground/70 block mb-1">الشهر</label>
                        <input type="number" min={1} max={12} value={lockMonth} onChange={(e) => setLockMonth(Number(e.target.value))} className="admin-input" dir="ltr" />
                    </div>
                    <div>
                        <label className="font-body text-sm text-foreground/70 block mb-1">السنة</label>
                        <input type="number" min={2020} max={2030} value={lockYear} onChange={(e) => setLockYear(Number(e.target.value))} className="admin-input" dir="ltr" />
                    </div>
                </div>
            </div>

            <button onClick={handleSave} disabled={saving} className="admin-save-btn">
                {saving ? <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <Save className="w-5 h-5" />}
                {saved ? "تم الحفظ ✅" : "حفظ الإعدادات"}
            </button>
        </div>
    );
};

export default SettingsSection;
