import { useState } from "react";
import { collection, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/youtubeUtils";
import { Plus, Trash2, Video, Pencil } from "lucide-react";

interface VideoItem {
    id: string;
    youtubeUrl?: string;
    caption?: string;
}

const VideosSection = () => {
    const { data: items } = useFirestoreCollection<VideoItem>("videos");
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [caption, setCaption] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleAdd = async () => {
        if (!youtubeUrl) return;
        const videoId = extractYouTubeId(youtubeUrl);
        if (!videoId) return alert("رابط اليوتيوب مش صحيح!");

        if (editingId) {
            await updateDoc(doc(db, "videos", editingId), { youtubeUrl, caption });
            setEditingId(null);
        } else {
            await addDoc(collection(db, "videos"), { youtubeUrl, caption });
        }
        setYoutubeUrl("");
        setCaption("");
    };

    const handleEdit = (item: VideoItem) => {
        setYoutubeUrl(item.youtubeUrl || "");
        setCaption(item.caption || "");
        setEditingId(item.id);
    };

    const handleDelete = async (id: string) => {
        if (confirm("متأكد تمسح الفيديو ده؟")) {
            await deleteDoc(doc(db, "videos", id));
        }
    };

    const currentPreviewId = youtubeUrl ? extractYouTubeId(youtubeUrl) : null;

    return (
        <div className="space-y-6">
            <div className="romantic-card p-6">
                <h3 className="font-display text-xl text-primary mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5" /> {editingId ? "تعديل فيديو" : "إضافة فيديو"}
                </h3>
                <div className="space-y-4">
                    <input value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="رابط اليوتيوب" className="admin-input" dir="ltr" />
                    {currentPreviewId && (
                        <img src={getYouTubeThumbnail(currentPreviewId)} alt="معاينة" className="rounded-lg max-h-40" />
                    )}
                    <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="الكابشن" className="admin-input" />
                    <button onClick={handleAdd} className="admin-save-btn">
                        {editingId ? "حفظ التعديل" : "إضافة الفيديو"}
                    </button>
                    {editingId && (
                        <button onClick={() => { setEditingId(null); setYoutubeUrl(""); setCaption(""); }} className="admin-cancel-btn w-full py-3 rounded-xl bg-secondary text-foreground font-body mt-2 hover:bg-secondary/80 outline-none">
                            إلغاء التعديل
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-3">
                {items.map((item) => {
                    const videoId = item.youtubeUrl ? extractYouTubeId(item.youtubeUrl) : null;
                    return (
                        <div key={item.id} className="romantic-card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="w-full sm:w-32 h-32 sm:h-20 rounded-lg overflow-hidden bg-secondary shrink-0 relative group">
                                {videoId ? (
                                    <img src={getYouTubeThumbnail(videoId)} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center"><Video className="w-6 h-6 text-muted-foreground" /></div>
                                )}
                            </div>
                            <div className="flex-1 w-full min-w-0 space-y-1">
                                <p className="font-body text-sm text-foreground truncate">{item.caption || "بدون كابشن"}</p>
                                <p className="font-body text-xs text-muted-foreground truncate" dir="ltr">{item.youtubeUrl}</p>
                            </div>
                            <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0 justify-end border-t sm:border-t-0 border-border/50 pt-3 sm:pt-0">
                                <button onClick={() => handleEdit(item)} className="text-primary hover:bg-primary/10 px-4 py-2 sm:p-2 rounded-lg transition-colors flex items-center justify-center gap-2 flex-1 sm:flex-none">
                                    <Pencil className="w-4 h-4" />
                                    <span className="text-xs font-body sm:hidden">تعديل</span>
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="text-destructive hover:bg-destructive/10 px-4 py-2 sm:p-2 rounded-lg transition-colors flex items-center justify-center gap-2 flex-1 sm:flex-none">
                                    <Trash2 className="w-4 h-4" />
                                    <span className="text-xs font-body sm:hidden">حذف</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
                {items.length === 0 && <p className="text-center font-body text-muted-foreground py-8">مفيش فيديوهات لسه. أضف فيديوهات جديدة!</p>}
            </div>
        </div>
    );
};

export default VideosSection;
