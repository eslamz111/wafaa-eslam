import { useState } from "react";
import { collection, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadImage } from "@/lib/uploadImage";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { Plus, Trash2, Upload, Image as ImageIcon, Pencil } from "lucide-react";

interface GalleryItem {
    id: string;
    imageUrl?: string;
    caption?: string;
    date?: string;
}

const GallerySection = () => {
    const { data: items } = useFirestoreCollection<GalleryItem>("gallery");
    const [caption, setCaption] = useState("");
    const [date, setDate] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) {
            setFile(f);
            setPreview(URL.createObjectURL(f));
        }
    };

    const handleAdd = async () => {
        if (!file && !editingId) return alert("اختار صورة الأول!");
        setUploading(true);
        try {
            let imageUrl = preview;
            if (file) {
                imageUrl = await uploadImage(file, setProgress);
            }

            if (editingId) {
                await updateDoc(doc(db, "gallery", editingId), { imageUrl, caption, date });
                setEditingId(null);
            } else {
                await addDoc(collection(db, "gallery"), { imageUrl, caption, date });
            }

            setCaption("");
            setDate("");
            setFile(null);
            setPreview("");
            setProgress(0);
        } catch (err: any) {
            alert(err.message || "حصل مشكلة!");
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (item: GalleryItem) => {
        setCaption(item.caption || "");
        setDate(item.date || "");
        setPreview(item.imageUrl || "");
        setFile(null); // Keep old image unless overridden
        setEditingId(item.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: string) => {
        if (confirm("متأكد تمسح الصورة دي؟")) {
            await deleteDoc(doc(db, "gallery", id));
        }
    };

    return (
        <div className="space-y-6">
            {/* Add new */}
            <div className="romantic-card p-6">
                <h3 className="font-display text-xl text-primary mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5" /> {editingId ? "تعديل صورة" : "إضافة صورة جديدة"}
                </h3>

                <div className="space-y-4">
                    <div
                        className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => document.getElementById("gallery-upload")?.click()}
                    >
                        {preview ? (
                            <img src={preview} alt="معاينة" className="max-h-48 mx-auto rounded-lg" />
                        ) : (
                            <>
                                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                                <p className="font-body text-muted-foreground">اضغط لاختيار صورة</p>
                                <p className="font-body text-xs text-muted-foreground mt-1">الحد الأقصى 10MB</p>
                            </>
                        )}
                        <input id="gallery-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </div>

                    {uploading && (
                        <div className="w-full bg-secondary rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                        </div>
                    )}

                    <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="الكابشن" className="admin-input" />
                    <input value={date} onChange={(e) => setDate(e.target.value)} placeholder="التاريخ (مثال: 5/3/2024)" className="admin-input" />

                    <button onClick={handleAdd} disabled={uploading} className="admin-save-btn">
                        {uploading ? "جاري الرفع..." : editingId ? "حفظ التعديل" : "إضافة الصورة"}
                    </button>
                    {editingId && (
                        <button onClick={() => { setEditingId(null); setCaption(""); setDate(""); setPreview(""); setFile(null); }} className="admin-cancel-btn w-full py-3 rounded-xl bg-secondary text-foreground font-body mt-2 hover:bg-secondary/80 outline-none">
                            إلغاء التعديل
                        </button>
                    )}
                </div>
            </div>

            {/* Existing */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {items.map((item) => (
                    <div key={item.id} className="romantic-card p-3 relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-secondary mb-2">
                            {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.caption} className="w-full h-full object-cover" loading="lazy" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                        <p className="font-body text-sm text-foreground/80 truncate">{item.caption}</p>
                        <p className="font-body text-xs text-muted-foreground">{item.date}</p>
                        <div className="absolute top-2 right-2 flex flex-col gap-2">
                            <button
                                onClick={() => handleEdit(item)}
                                className="w-7 h-7 rounded-full bg-primary/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="w-7 h-7 rounded-full bg-destructive/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {items.length === 0 && <p className="text-center font-body text-muted-foreground py-8">مفيش صور لسه. أضف صور جديدة!</p>}
        </div>
    );
};

export default GallerySection;
