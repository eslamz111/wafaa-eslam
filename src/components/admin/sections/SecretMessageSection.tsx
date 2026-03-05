import { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Save, Lock } from "lucide-react";

const SecretMessageSection = () => {
    const [modalText, setModalText] = useState("");
    const [personalVideoUrl, setPersonalVideoUrl] = useState("");
    const [personalVideoCaption, setPersonalVideoCaption] = useState("");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const secretDoc = await getDoc(doc(db, "settings", "secretMessage"));
                if (secretDoc.exists()) {
                    setModalText(secretDoc.data().modalText || "");
                }
                const videoDoc = await getDoc(doc(db, "settings", "personalVideo"));
                if (videoDoc.exists()) {
                    const d = videoDoc.data();
                    setPersonalVideoUrl(d.youtubeUrl || "");
                    setPersonalVideoCaption(d.caption || "");
                }
            } catch (err) {
                console.error("Error loading:", err);
            }
        };
        load();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, "settings", "secretMessage"), { modalText });
            await setDoc(doc(db, "settings", "personalVideo"), { youtubeUrl: personalVideoUrl, caption: personalVideoCaption });
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
            <div className="romantic-card p-6">
                <h3 className="font-display text-xl text-primary mb-4 flex items-center gap-2">
                    <Lock className="w-5 h-5" /> الرسالة السرية
                </h3>
                <p className="font-body text-sm text-muted-foreground mb-4">
                    الرسالة دي هتظهر لما تضغط على "دوسي متستعجليش". اكتب كل كلمة في سطر جديد عشان الأنميشن يشتغل صح.
                </p>
                <textarea
                    value={modalText}
                    onChange={(e) => setModalText(e.target.value)}
                    placeholder={"بصي بقى...\n\nأنا بحبك أكتر ما تتخيلي\n\nوجودك في حياتي نعمة كبيرة\n\nبحبك يا وفا ❤️\n\n– إسلام"}
                    className="admin-input min-h-[200px]"
                    dir="rtl"
                />
            </div>

            <div className="romantic-card p-6">
                <h3 className="font-display text-xl text-primary mb-4">🎬 رسالة فيديو شخصية</h3>
                <div className="space-y-3">
                    <input
                        value={personalVideoUrl}
                        onChange={(e) => setPersonalVideoUrl(e.target.value)}
                        placeholder="رابط اليوتيوب"
                        className="admin-input"
                        dir="ltr"
                    />
                    <input
                        value={personalVideoCaption}
                        onChange={(e) => setPersonalVideoCaption(e.target.value)}
                        placeholder="الكابشن"
                        className="admin-input"
                    />
                </div>
            </div>

            <button onClick={handleSave} disabled={saving} className="admin-save-btn">
                {saving ? <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <Save className="w-5 h-5" />}
                {saved ? "تم الحفظ ✅" : "حفظ"}
            </button>
        </div>
    );
};

export default SecretMessageSection;
