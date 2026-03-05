import { useState, useEffect } from "react";
import {
    collection,
    onSnapshot,
    query,
    orderBy,
    DocumentData,
    QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface UseFirestoreCollectionResult<T> {
    data: T[];
    loading: boolean;
    error: string | null;
}

export function useFirestoreCollection<T = DocumentData>(
    collectionName: string,
    orderByField?: string,
    orderDirection: "asc" | "desc" = "asc"
): UseFirestoreCollectionResult<T> {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!collectionName) {
            setLoading(false);
            return;
        }

        const constraints: QueryConstraint[] = [];
        if (orderByField) {
            constraints.push(orderBy(orderByField, orderDirection));
        }

        const q = query(collection(db, collectionName), ...constraints);
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const items = snapshot.docs.map(
                    (doc) => ({ id: doc.id, ...doc.data() } as T)
                );
                setData(items);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error("Firestore collection error:", err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [collectionName, orderByField, orderDirection]);

    return { data, loading, error };
}
