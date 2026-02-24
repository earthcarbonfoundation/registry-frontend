"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

export interface ActionRecord {
  id: string;
  actionType: string;
  quantity: number;
  unit: string;
  address: string;
  createdAt: Timestamp;
}

export const useActionRecordTable = () => {
  const { user, loading: authLoading } = useAuth();
  const [actions, setActions] = useState<ActionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // If auth is still loading, wait.
    if (authLoading) return;

    // If auth finished but no user, stop loading (show empty or restricted).
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const q = query(
      collection(db, "actions"),
      where("userId", "==", user.uid),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedActions = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ActionRecord[];

        // Sort client-side to avoid compound index requirement
        fetchedActions.sort((a, b) => {
          const timeA = a.createdAt?.toMillis() || 0;
          const timeB = b.createdAt?.toMillis() || 0;
          return timeB - timeA; // Descending order
        });

        setActions(fetchedActions);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching actions:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user, authLoading]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "actions", id));
      toast.success("Action deleted successfully.");
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error("Failed to delete action.");
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = actions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(actions.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return {
    actions,
    loading,
    currentItems,
    currentPage,
    totalPages,
    handlePageChange,
    handleDelete,
  };
};
