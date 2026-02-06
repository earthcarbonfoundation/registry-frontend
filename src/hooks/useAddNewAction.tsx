"use client";
import { toast } from "react-toastify";
import { useState } from "react";
import { db } from "@/firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

export const useAddNewAction = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAction, setEditingAction] = useState<any>(null);

  const handleOpenModal = () => {
    setEditingAction(null);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);

  const handleEditAction = (action: any) => {
    setEditingAction(action);
    setIsModalOpen(true);
  };

  const handleSubmitAction = async (data: any) => {
    if (!user) {
      toast.error("You must be signed in to submit an action.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingAction) {
        const docRef = doc(db, "carbon_registry_actions", editingAction.id);
        await updateDoc(docRef, {
          ...data,
          quantity: parseFloat(data.quantity),
          updatedAt: serverTimestamp(),
        });
        console.log("Action updated with ID:", editingAction.id);
      } else {
        await addDoc(collection(db, "carbon_registry_actions"), {
          ...data,
          quantity: parseFloat(data.quantity), // Ensure quantity is a number
          userId: user.uid,
          userEmail: user.email,
          createdAt: serverTimestamp(),
        });
      }

      // STOP LOADING BEFORE TOAST
      setIsSubmitting(false);
      handleCloseModal();

      // Ideally we should refresh the list here.
      // For now, since table is separate, a reload might be needed or event bus.
      // But standard practice is usually to reload page or use SWR/React Query.
      // We'll rely on a window reload for absolute safety until shared state is added.
      // window.location.reload(); // Removed as client-side updates don't require full page reload

      setTimeout(() => {
        toast.success(
          editingAction
            ? "Action updated successfully!"
            : "Action submitted successfully!",
        );
      }, 100);
    } catch (error: any) {
      setIsSubmitting(false);
      console.error("Error adding document: ", error);

      if (error.message && error.message.includes("offline")) {
        toast.error("Network Error: Please check your internet connection.");
      } else {
        toast.error(
          `Failed to submit action: ${error.message || "Please try again."}`,
        );
      }
      throw error;
    }
  };

  return {
    isModalOpen,
    isSubmitting,
    editingAction,
    handleOpenModal,
    handleCloseModal,
    handleEditAction,
    handleSubmitAction,
  };
};
