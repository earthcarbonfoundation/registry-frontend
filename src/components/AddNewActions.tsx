"use client";

import React from "react";
import ActionModal from "@/components/ActionModal";
import ActionRecordTable from "./ActionRecordTable";
import AddIcon from "./svg/AddIcon";
import { useAddNewAction } from "@/hooks/useAddNewAction";
import GoogleMapVIew from "./GoogleMapVIew";

export default function ActionsPage({
  locations,
}: {
  locations?: { address: string }[];
}) {
  const {
    isModalOpen,
    isSubmitting,
    editingAction,
    handleOpenModal,
    handleCloseModal,
    handleEditAction,
    handleSubmitAction,
  } = useAddNewAction();

  return (
    <div className='min-h-[calc(100vh-82px)] bg-gray-200 p-8'>
      <div className='max-w-5xl mx-auto space-y-6'>
        <div className='flex justify-end'>
          <button
            onClick={handleOpenModal}
            className='flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 active:scale-[0.98] shadow-sm active:bg-gray-100'
          >
            <AddIcon />
            Add New Action
          </button>
        </div>

        {/* Action Table */}
        <ActionRecordTable onEdit={handleEditAction} />

        <GoogleMapVIew locations={locations} />
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
