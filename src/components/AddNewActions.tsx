"use client";

import React from "react";
import ActionModal from "@/components/ActionModal";
import ActionRecordTable from "./ActionRecordTable";
import AddIcon from "./svg/AddIcon";
import { useAddNewAction } from "@/hooks/useAddNewAction";

export default function ActionsPage() {
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
    <div className='min-h-[calc(100vh-82px)] bg-gray-50 px-8 py-8'>
      <div className='w-full space-y-6'>
        <div className='flex justify-between items-center'>
          <h2 className='text-lg font-bold text-gray-800'>Actions</h2>
          <button
            onClick={handleOpenModal}
            className='flex items-center justify-center gap-2 px-6 py-3 bg-[rgb(32,38,130)] border border-[rgb(32,38,130)] text-white font-semibold rounded-xl hover:bg-[rgb(25,30,110)] transition-all duration-200 active:scale-[0.98] shadow-sm hover:-translate-y-0.5 cursor-pointer'
          >
            <AddIcon />
            Add New Action
          </button>
        </div>

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
