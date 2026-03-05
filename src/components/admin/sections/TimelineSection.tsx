import { useState } from "react";
import { collection, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { Plus, Trash2, Pencil } from "lucide-react";

interface TimelineItem { id: string; date?: string; title?: string; description?: string; }

const TimelineSection = () => {
    const { data: items } = useFirestoreCollection<TimelineItem>("timeline");
    const [date, setDate] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleAdd = async () => {
        if (!title) return;
        if (editingId) {
            await updateDoc(doc(db, "timeline", editingId), { date, title, description });
            setEditingId(null);
        } else {
            await addDoc(collection(db, "timeline"), { date, title, description });
        }
        setDate(""); setTitle(""); setDescription("");
    };

    const handleEdit = (item: TimelineItem) => {
        setDate(item.date || "");
        setTitle(item.title || "");
        setDescription(item.description || "");
        setEditingId(item.id);
    };

    const handleDelete = async (id: string) => {
        if (confirm("متأكد تمسح؟")) await deleteDoc(doc(db, "timeline", id));
    };

    return (
        <div className="space-y-6">
            <div className="romantic-card p-6">
                <h3 className="font-display text-xl text-primary mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5" /> {editingId ? "تعديل حدث" : "إضافة حدث"}
                </h3>
                <div className="space-y-3">
                    <input value={date} onChange={(e) => setDate(e.target.value)} placeholder="التاريخ" className="admin-input" />
                    <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="العنوان" className="admin-input" />
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="الوصف" className="admin-input min-h-[80px]" />
                    <button onClick={handleAdd} className="admin-save-btn">
                        {editingId ? "حفظ التعديل" : "إضافة"}
                    </button>
                    {editingId && (
                        <button onClick={() => { setEditingId(null); setDate(""); setTitle(""); setDescription(""); }} className="admin-cancel-btn w-full py-3 rounded-xl bg-secondary text-foreground font-body mt-2 hover:bg-secondary/80 outline-none">
                            إلغاء التعديل
                        </button>
                    )}
                </div>
            </div>
            <div className="space-y-3">
                {items.map((item) => (
                    <div key={item.id} className="romantic-card p-4 flex items-start gap-3">
                        <div className="flex-1">
                            <p className="font-body text-xs text-muted-foreground">{item.date}</p>
                            <p className="font-body font-bold text-foreground">{item.title}</p>
                            <p className="font-body text-sm text-foreground/70">{item.description}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button onClick={() => handleEdit(item)} className="text-primary hover:bg-primary/10 p-2 rounded-lg"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(item.id)} className="text-destructive hover:bg-destructive/10 p-2 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </div>
                ))}
                {items.length === 0 && <p className="text-center font-body text-muted-foreground py-8">مفيش أحداث لسه!</p>}
            </div>
        </div>
    );
};

export default TimelineSection;
