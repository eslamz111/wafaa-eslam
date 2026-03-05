import { useState } from "react";
import { collection, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { Plus, Trash2, Heart, Pencil } from "lucide-react";

interface NoteItem { id: string; front?: string; back?: string; }

const LoveNotesSection = () => {
    const { data: items } = useFirestoreCollection<NoteItem>("loveNotes");
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleAdd = async () => {
        if (!front.trim() || !back.trim()) return;
        if (editingId) {
            await updateDoc(doc(db, "loveNotes", editingId), { front, back });
            setEditingId(null);
        } else {
            await addDoc(collection(db, "loveNotes"), { front, back });
        }
        setFront(""); setBack("");
    };

    const handleEdit = (item: NoteItem) => {
        setFront(item.front || "");
        setBack(item.back || "");
        setEditingId(item.id);
    };

    const handleDelete = async (id: string) => {
        if (confirm("متأكد تمسح الرسالة دي؟")) await deleteDoc(doc(db, "loveNotes", id));
    };

    return (
        <div className="space-y-6">
            <div className="romantic-card p-6">
                <h3 className="font-display text-xl text-primary mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5" /> {editingId ? "تعديل رسالة حب" : "إضافة رسالة حب"}
                </h3>
                <div className="space-y-3">
                    <input value={front} onChange={(e) => setFront(e.target.value)} placeholder="وجه الكارت (العنوان)" className="admin-input" />
                    <textarea value={back} onChange={(e) => setBack(e.target.value)} placeholder="ضهر الكارت (الرسالة)" className="admin-input min-h-[80px]" />
                    <button onClick={handleAdd} className="admin-save-btn">
                        {editingId ? "حفظ التعديل" : "إضافة"}
                    </button>
                    {editingId && (
                        <button onClick={() => { setEditingId(null); setFront(""); setBack(""); }} className="admin-cancel-btn w-full py-3 rounded-xl bg-secondary text-foreground font-body mt-2 hover:bg-secondary/80 outline-none">
                            إلغاء التعديل
                        </button>
                    )}
                </div>
            </div>
            <div className="space-y-2">
                {items.map((item) => (
                    <div key={item.id} className="romantic-card p-4 flex items-start gap-3">
                        <Heart className="w-4 h-4 text-primary shrink-0 mt-1" />
                        <div className="flex-1">
                            <p className="font-body font-bold text-foreground">{item.front}</p>
                            <p className="font-body text-sm text-foreground/70">{item.back}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button onClick={() => handleEdit(item)} className="text-primary hover:bg-primary/10 p-2 rounded-lg"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(item.id)} className="text-destructive hover:bg-destructive/10 p-2 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </div>
                ))}
                {items.length === 0 && <p className="text-center font-body text-muted-foreground py-8">مفيش رسائل لسه!</p>}
            </div>
        </div>
    );
};

export default LoveNotesSection;
