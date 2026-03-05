import { useState } from "react";
import { collection, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { Plus, Trash2, Sparkles, Pencil } from "lucide-react";

interface DreamItem { id: string; icon?: string; text?: string; }

const DreamsSection = () => {
    const { data: items } = useFirestoreCollection<DreamItem>("futurePlans");
    const [icon, setIcon] = useState("✈️");
    const [text, setText] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleAdd = async () => {
        if (!text.trim()) return;
        if (editingId) {
            await updateDoc(doc(db, "futurePlans", editingId), { icon, text });
            setEditingId(null);
        } else {
            await addDoc(collection(db, "futurePlans"), { icon, text });
        }
        setIcon("✈️"); setText("");
    };

    const handleEdit = (item: DreamItem) => {
        setIcon(item.icon || "✈️");
        setText(item.text || "");
        setEditingId(item.id);
    };

    const handleDelete = async (id: string) => {
        if (confirm("متأكد تمسح؟")) await deleteDoc(doc(db, "futurePlans", id));
    };

    return (
        <div className="space-y-6">
            <div className="romantic-card p-6">
                <h3 className="font-display text-xl text-primary mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5" /> {editingId ? "تعديل حلم" : "إضافة حلم"}
                </h3>
                <div className="space-y-3">
                    <div className="flex gap-3">
                        <input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="الإيموجي" className="admin-input w-20 text-center text-2xl" />
                        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="الحلم..." className="admin-input flex-1" />
                    </div>
                    <button onClick={handleAdd} className="admin-save-btn">
                        {editingId ? "حفظ التعديل" : "إضافة"}
                    </button>
                    {editingId && (
                        <button onClick={() => { setEditingId(null); setIcon("✈️"); setText(""); }} className="admin-cancel-btn w-full py-3 rounded-xl bg-secondary text-foreground font-body mt-2 hover:bg-secondary/80 outline-none">
                            إلغاء التعديل
                        </button>
                    )}
                </div>
            </div>
            <div className="space-y-2">
                {items.map((item) => (
                    <div key={item.id} className="romantic-card p-4 flex items-center gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <p className="font-body text-foreground flex-1">{item.text}</p>
                        <button onClick={() => handleEdit(item)} className="text-primary hover:bg-primary/10 p-2 rounded-lg"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(item.id)} className="text-destructive hover:bg-destructive/10 p-2 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                ))}
                {items.length === 0 && <p className="text-center font-body text-muted-foreground py-8">مفيش أحلام لسه!</p>}
            </div>
        </div>
    );
};

export default DreamsSection;
