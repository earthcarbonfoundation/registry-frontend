"use client";

import React, { useState } from "react";
import ActionModal from "@/components/ActionModal";
import { db } from "@/firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import ActionRecordTable from "./ActionRecordTable";
import AddIcon from "./svg/AddIcon";

export default function ActionsPage() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAction, setEditingAction] = useState<any>(null);

  const handleOpenModal = () => {
    setEditingAction(null);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmitAction = async (data: any) => {
    if (!user) {
      alert("You must be signed in to submit an action.");
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
        const docRef = await addDoc(collection(db, "carbon_registry_actions"), {
          ...data,
          quantity: parseFloat(data.quantity), // Ensure quantity is a number
          userId: user.uid,
          userEmail: user.email,
          createdAt: serverTimestamp(),
        });
        console.log("Action stored with ID:", docRef.id);
      }

      // STOP LOADING BEFORE ALERT
      setIsSubmitting(false);
      handleCloseModal();

      // Small delay to let the modal close smoothly before the alert blocks the UI
      setTimeout(() => {
        alert(
          editingAction
            ? "Action updated successfully!"
            : "Action submitted successfully!",
        );
      }, 100);
    } catch (error: any) {
      setIsSubmitting(false);
      console.error("Error adding document: ", error);

      if (error.message && error.message.includes("offline")) {
        alert(
          "Network Error: Please check your internet connection and try again.",
        );
      } else {
        alert(
          `Failed to submit action: ${error.message || "Please try again."}`,
        );
      }
      throw error;
    }
  };

  const handleEditAction = (action: any) => {
    setEditingAction(action);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-[calc(100vh-82px)] bg-gray-200 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Card */}
        {/* <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
              Impact Actions
            </h1>
            <p className="text-sm text-gray-400 font-medium">
              Manage and track your environmental contributions.
            </p>
          </div>

          <button
            onClick={handleOpenModal}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 active:scale-[0.98] shadow-sm active:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New Action
          </button>
        </div> */}
        <div className="flex justify-end">
          <button
            onClick={handleOpenModal}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 active:scale-[0.98] shadow-sm active:bg-gray-100"
          >
         <AddIcon/>
            Add New Action
          </button>
        </div>
        {/* Empty State / List Placeholder */}
        {/* <div className="bg-white/50 border-2 border-dashed border-gray-300 rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <h3 className="text-gray-500 font-semibold text-lg">
            No actions yet
          </h3>
          <p className="text-gray-400 text-sm max-w-[240px] mt-1">
            Start by adding your first environmental impact action today.
          </p>
        </div> */}

        {/* Action Table */}
        <ActionRecordTable onEdit={handleEditAction} />
      </div>

      <ActionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitAction}
        isSubmitting={isSubmitting}
        initialData={editingAction}
      />
    </div>
  );
}
