import { useState } from "react";
import { collection, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { Plus, Trash2, Music, Star, Pencil, Upload } from "lucide-react";

interface SongItem { id: string; title?: string; artist?: string; audioUrl?: string; isFavorite?: boolean; }

const SongsSection = () => {
    const { data: items } = useFirestoreCollection<SongItem>("songs");
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [audioUrl, setAudioUrl] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) setFile(f);
    };

    const handleAdd = async () => {
        if (!title.trim()) return;
        if (!audioUrl && !file && !editingId) return alert("اختار ملف صوتي أو حط رابط مباشر!");

        setUploading(true);
        try {
            let finalAudioUrl = audioUrl;

            // Upload via local Vite middleware API
            if (file) {
                const response = await fetch(`/api/upload-song?filename=${encodeURIComponent(file.name)}`, {
                    method: 'POST',
                    body: file,
                    headers: {
                        'Content-Type': 'application/octet-stream'
                    }
                });

                if (!response.ok) throw new Error("فشل الرفع المحلي");

                const data = await response.json();

                // Add a cache buster and ensure it's not cached aggressively for proper playback initially
                finalAudioUrl = `${data.url}?t=${Date.now()}`;
            }

            if (editingId) {
                await updateDoc(doc(db, "songs", editingId), { title, artist, audioUrl: finalAudioUrl || audioUrl });
                setEditingId(null);
            } else {
                await addDoc(collection(db, "songs"), { title, artist, audioUrl: finalAudioUrl, isFavorite: items.length === 0 });
            }

            setTitle(""); setArtist(""); setAudioUrl(""); setFile(null);
        } catch (err: any) {
            alert(err.message || "حصل مشكلة في الرفع!");
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (item: SongItem) => {
        setTitle(item.title || "");
        setArtist(item.artist || "");
        setAudioUrl(item.audioUrl || "");
        setFile(null);
        setEditingId(item.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: string) => {
        if (confirm("متأكد تمسح الأغنية دي؟")) await deleteDoc(doc(db, "songs", id));
    };

    const setFavorite = async (id: string) => {
        // Unmark all
        for (const item of items) {
            if (item.isFavorite) await updateDoc(doc(db, "songs", item.id), { isFavorite: false });
        }
        // Mark new favorite
        await updateDoc(doc(db, "songs", id), { isFavorite: true });
    };

    return (
        <div className="space-y-6">
            <div className="romantic-card p-6">
                <h3 className="font-display text-xl text-primary mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5" /> {editingId ? "تعديل أغنية" : "إضافة أغنية"}
                </h3>
                <div className="space-y-4">
                    <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="اسم الأغنية" className="admin-input" />
                    <input value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="اسم الفنان" className="admin-input" />

                    <div className="p-4 border border-dashed rounded-xl border-border bg-secondary/20 space-y-3">
                        <p className="font-body text-sm font-bold text-primary">ملف الأغنية (رفع محلي لمجلد الأغاني):</p>

                        <div className="flex gap-3 items-center">
                            <label className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 transition-colors shrink-0">
                                <Upload className="w-5 h-5" />
                                <input type="file" accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac,.webm" className="hidden" onChange={handleFileChange} />
                            </label>
                            <div className="flex-1">
                                {file ? (
                                    <p className="font-body text-sm text-foreground truncate">{file.name}</p>
                                ) : (
                                    <p className="font-body text-sm text-muted-foreground">مفيش ملف مرفوع</p>
                                )}
                            </div>
                        </div>

                        <div className="relative flex items-center gap-4 py-2">
                            <div className="flex-1 border-t border-border"></div>
                            <span className="font-body text-xs text-muted-foreground uppercase">أو</span>
                            <div className="flex-1 border-t border-border"></div>
                        </div>

                        <input value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} placeholder="رابط الأغنية المباشر (اختياري لو رفعت ملف)" className="admin-input" dir="ltr" />
                    </div>

                    <button onClick={handleAdd} disabled={uploading} className="admin-save-btn">
                        {uploading ? `جاري الرفع...` : editingId ? "حفظ التعديل" : "إضافة"}
                    </button>
                    {editingId && (
                        <button onClick={() => { setEditingId(null); setTitle(""); setArtist(""); setAudioUrl(""); setFile(null); }} className="admin-cancel-btn w-full py-3 rounded-xl bg-secondary text-foreground font-body mt-2 hover:bg-secondary/80 outline-none">
                            إلغاء التعديل
                        </button>
                    )}
                </div>
            </div>

            <p className="font-body text-sm text-muted-foreground">⭐ اضغط على النجمة عشان تعملها الأغنية المفضلة اللي هتشتغل أوتوماتيك بعد فتح القفل</p>

            <div className="space-y-2">
                {items.map((item) => (
                    <div key={item.id} className={`romantic-card p-4 flex flex-col gap-3 ${item.isFavorite ? "ring-2 ring-primary/30" : ""}`}>
                        <div className="flex items-center gap-3">
                            <Music className="w-5 h-5 text-primary shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="font-body font-bold text-foreground">{item.title} {item.isFavorite && "⭐"}</p>
                                {item.artist && <p className="font-body text-xs text-muted-foreground">{item.artist}</p>}
                            </div>
                            <div className="flex flex-col gap-1 items-center">
                                <button onClick={() => setFavorite(item.id)} className={`p-2 rounded-lg transition-colors ${item.isFavorite ? "text-yellow-500" : "text-muted-foreground hover:text-yellow-500"}`}>
                                    <Star className="w-4 h-4" fill={item.isFavorite ? "currentColor" : "none"} />
                                </button>
                                <button onClick={() => handleEdit(item)} className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors">
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        {item.audioUrl && (
                            <audio controls src={item.audioUrl} className="w-full h-8" controlsList="nodownload" preload="none" />
                        )}
                    </div>
                ))}
                {items.length === 0 && <p className="text-center font-body text-muted-foreground py-8">مفيش أغاني لسه!</p>}
            </div>
        </div>
    );
};

export default SongsSection;
