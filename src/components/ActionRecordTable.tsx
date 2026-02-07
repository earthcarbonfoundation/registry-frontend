"use client";

import React from "react";
import {
  useActionRecordTable,
  ActionRecord,
} from "@/hooks/useActionRecordTable";
import { Timestamp } from "firebase/firestore";

interface ActionRecordTableProps {
  onEdit: (record: ActionRecord) => void;
}

const ACTION_LABELS: Record<string, string> = {
  solar_rooftop: "Solar Rooftop",
  swh: "Solar Water Heater",
  rwh: "Rainwater Harvesting",
  waterless_urinal: "Waterless Urinal",
  wastewater_recycling: "Wastewater Recycling",
  biogas: "Biogas (Food Waste)",
  led_replacement: "LED Replacement",
  tree_plantation: "Tree Plantation",
};

import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { useState } from "react";
import DeleteIcon from "./svg/DeleteIcon";
import EditIcon from "./svg/EditIcon";
import ActionNotFoundIcon from "./svg/ActionNotFoundIcon";

export default function ActionRecordTable({ onEdit }: ActionRecordTableProps) {
  const {
    actions,
    loading,
    currentItems,
    currentPage,
    totalPages,
    handlePageChange,
    handleDelete,
  } = useActionRecordTable();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [actionToDelete, setActionToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (id: string) => {
    setActionToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (actionToDelete) {
      setIsDeleting(true);
      await handleDelete(actionToDelete);
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setActionToDelete(null);
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate();
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  };

  if (loading) {
    return (
      <div className='flex justify-center p-8'>
        <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  if (actions.length === 0) {
    return (
      <div className='bg-white/50 border-2 border-dashed border-gray-300 rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center mt-6'>
        <div className='w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300 mb-4'>
          <ActionNotFoundIcon />
        </div>
        <h3 className='text-gray-500 font-semibold text-lg'>No actions yet</h3>
        <p className='text-gray-400 text-sm max-w-[240px] mt-1'>
          Start by adding your first environmental impact action today.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6 mt-6'>
      {/* Desktop Grid View */}
      <div className='hidden md:block bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden'>
        <div className='min-w-full'>
          {/* Header */}
          <div className='grid grid-cols-[1.5fr_1.5fr_2fr_1.5fr_1fr] bg-gray-50/50 border-b border-gray-100/50'>
            <div className='py-5 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider'>
              Action Type
            </div>
            <div className='py-5 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider'>
              Units
            </div>
            <div className='py-5 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider'>
              Address
            </div>
            <div className='py-5 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider'>
              Created At
            </div>
            <div className='py-5 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right'>
              Action
            </div>
          </div>

          {/* Body */}
          <div className='divide-y divide-gray-50'>
            {currentItems.map((action) => (
              <div
                key={action.id}
                className='grid grid-cols-[1.5fr_1.5fr_2fr_1.5fr_1fr] hover:bg-gray-50/50 transition-colors group items-center'
              >
                <div className='py-5 px-6 text-sm font-semibold text-gray-700'>
                  {ACTION_LABELS[action.actionType] || action.actionType}
                </div>
                <div className='py-5 px-6 text-sm font-medium text-gray-600'>
                  {action.quantity} {action.unit}
                </div>
                <div
                  className='py-5 px-6 text-sm text-gray-500 truncate'
                  title={action.address}
                >
                  {action.address}
                </div>
                <div className='py-5 px-6 text-sm text-gray-400 whitespace-nowrap'>
                  {formatDate(action.createdAt)}
                </div>
                <div className='py-5 px-6 text-right'>
                  <div className='flex items-center justify-end gap-2'>
                    <button
                      onClick={() => onEdit(action)}
                      className='px-4 py-2 bg-gray-500 text-white text-xs font-semibold rounded-lg hover:bg-gray-600 transition-colors shadow-sm'
                    >
                      <EditIcon className='h-4 w-4' />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(action.id)}
                      className='px-4 py-2 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors shadow-sm'
                    >
                      <DeleteIcon className='h-4 w-4' />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className='md:hidden grid grid-cols-1 gap-4'>
        {currentItems.map((action) => (
          <div
            key={action.id}
            className='bg-white rounded-[1.5rem] border border-gray-100 p-5 shadow-sm space-y-4'
          >
            <div className='flex justify-between items-start'>
              <div>
                <h3 className='font-semibold text-gray-800 text-lg'>
                  {ACTION_LABELS[action.actionType] || action.actionType}
                </h3>
                <p className='text-xs text-gray-400 mt-1'>
                  {formatDate(action.createdAt)}
                </p>
              </div>
              <span className='px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600'>
                {action.quantity} {action.unit}
              </span>
            </div>

            <div className='flex items-start gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl'>
              <span className='truncate'>{action.address}</span>
            </div>

            <div className='grid grid-cols-2 gap-3 pt-2'>
              <button
                onClick={() => onEdit(action)}
                className='py-2.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors'
              >
                <EditIcon className='h-4 w-4 text-gray-600' />
              </button>
              <button
                onClick={() => handleDeleteClick(action.id)}
                className='py-2.5 bg-red-50 text-red-500 text-sm font-semibold rounded-lg hover:bg-red-100 transition-colors'
              >
                <DeleteIcon className='h-4 w-4 text-red-500' />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className='flex justify-center items-center gap-4 mt-6'>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-xl border border-gray-200 ${
            currentPage === 1
              ? "bg-gray-50 text-gray-300 cursor-not-allowed"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        ></button>
        <span className='text-sm font-semibold text-gray-600'>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-xl border border-gray-200 ${
            currentPage === totalPages
              ? "bg-gray-50 text-gray-300 cursor-not-allowed"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        ></button>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
