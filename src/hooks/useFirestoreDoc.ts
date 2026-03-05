import { useState, useEffect } from "react";
import { doc, onSnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface UseFirestoreDocResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export function useFirestoreDoc<T = DocumentData>(
    collectionName: string,
    documentId: string
): UseFirestoreDocResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!collectionName || !documentId) {
            setLoading(false);
            return;
        }

        const docRef = doc(db, collectionName, documentId);
        const unsubscribe = onSnapshot(
            docRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    setData({ id: snapshot.id, ...snapshot.data() } as T);
                } else {
                    setData(null);
                }
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error("Firestore doc error:", err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [collectionName, documentId]);

    return { data, loading, error };
}
