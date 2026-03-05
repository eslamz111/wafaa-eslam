import { useState } from "react";
import { collection, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { Plus, Trash2, Heart, Pencil } from "lucide-react";

interface PromiseItem { id: string; text?: string; }

const PromisesSection = () => {
    const { data: items } = useFirestoreCollection<PromiseItem>("promises");
    const [text, setText] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleAdd = async () => {
        if (!text.trim()) return;
        if (editingId) {
            await updateDoc(doc(db, "promises", editingId), { text });
            setEditingId(null);
        } else {
            await addDoc(collection(db, "promises"), { text });
        }
        setText("");
    };

    const handleEdit = (item: PromiseItem) => {
        setText(item.text || "");
        setEditingId(item.id);
    };

    const handleDelete = async (id: string) => {
        if (confirm("متأكد تمسح الوعد ده؟")) await deleteDoc(doc(db, "promises", id));
    };

    return (
        <div className="space-y-6">
            <div className="romantic-card p-6">
                <h3 className="font-display text-xl text-primary mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5" /> {editingId ? "تعديل وعد" : "إضافة وعد"}
                </h3>
                <div className="space-y-3">
                    <input value={text} onChange={(e) => setText(e.target.value)} placeholder="أوعدك إن..." className="admin-input" onKeyDown={(e) => e.key === "Enter" && handleAdd()} />
                    <button onClick={handleAdd} className="admin-save-btn px-6">
                        {editingId ? "حفظ" : "أضف"}
                    </button>
                    {editingId && (
                        <button onClick={() => { setEditingId(null); setText(""); }} className="admin-cancel-btn w-full py-3 rounded-xl bg-secondary text-foreground font-body hover:bg-secondary/80 outline-none">
                            إلغاء
                        </button>
                    )}
                </div>
            </div>
            <div className="space-y-2">
                {items.map((item) => (
                    <div key={item.id} className="romantic-card p-4 flex items-center gap-3">
                        <Heart className="w-4 h-4 text-primary shrink-0" />
                        <p className="font-body text-foreground flex-1">{item.text}</p>
                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(item)} className="text-primary hover:bg-primary/10 p-2 rounded-lg"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(item.id)} className="text-destructive hover:bg-destructive/10 p-2 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </div>
                ))}
                {items.length === 0 && <p className="text-center font-body text-muted-foreground py-8">مفيش وعود لسه!</p>}
            </div>
        </div>
    );
};

export default PromisesSection;
