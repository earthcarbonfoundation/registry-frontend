"use client";
import { toast } from "react-toastify";
import { useState } from "react";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

interface ActionData {
  actionType: string;
  quantity: number;
  unit: string;
  address: string;
  lat?: number | null;
  lng?: number | null;
}

interface EditingAction extends ActionData {
  id: string;
  createdAt?: any;
  userId?: string;
  userEmail?: string;
}

export const useAddNewAction = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAction, setEditingAction] = useState<EditingAction | null>(
    null,
  );

  const handleOpenModal = () => {
    setEditingAction(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleEditAction = (action: EditingAction) => {
    setEditingAction(action);
    setIsModalOpen(true);
  };

  const handleSubmitAction = async (data: ActionData) => {
    if (!user) {
      toast.error("You must be signed in to submit an action.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingAction && editingAction.id) {
        const docRef = doc(db, "carbon_registry_actions", editingAction.id);
        await updateDoc(docRef, {
          actionType: data.actionType,
          quantity: Number(data.quantity),
          unit: data.unit,
          address: data.address,
          lat: data.lat || null,
          lng: data.lng || null,
          updatedAt: serverTimestamp(),
        });
        console.log("Action updated with ID:", editingAction.id);
      } else {
        await addDoc(collection(db, "carbon_registry_actions"), {
          actionType: data.actionType,
          quantity: Number(data.quantity),
          unit: data.unit,
          address: data.address,
          lat: data.lat || null,
          lng: data.lng || null,
          userId: user.uid,
          userEmail: user.email,
          createdAt: serverTimestamp(),
        });
      }

      setIsSubmitting(false);
      handleCloseModal();

      // Show success toast after brief delay
      setTimeout(() => {
        toast.success(
          editingAction
            ? "Action updated successfully!"
            : "Action submitted successfully!",
        );
      }, 100);
    } catch (error: any) {
      setIsSubmitting(false);
      console.error("Error submitting action: ", error);

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
