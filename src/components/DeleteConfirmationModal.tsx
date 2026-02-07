import React from "react";
import CloseButtonIcon from "./svg/CloseButtonIcon";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  title?: string;
  message?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  title = "Delete Action",
  message = "Are you sure you want to delete this action? This can't be undone.",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 bg-gray-900/10 backdrop-blur-sm flex justify-center items-center z-[1000] p-4 transition-all duration-300'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-[2rem] w-full max-w-sm shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden transform transition-all duration-300 scale-100 relative'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Delete Title and Close Button */}
        <div className='flex items-center justify-between px-8 pt-8 pb-6 border-b border-gray-100'>
          <h2 className='text-xl font-semibold text-gray-800 tracking-tight'>
            Delete
          </h2>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className={`p-2 rounded-xl hover:bg-gray-50 transition-colors text-gray-300 hover:text-gray-500 ${
              isDeleting ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <CloseButtonIcon />
          </button>
        </div>

        {/* Content */}
        <div className='px-8 py-8 text-center'>
          <h3 className='text-lg font-semibold text-gray-800 mb-2'>{title}</h3>
          <p className='text-gray-500 text-sm mb-10'>{message}</p>

          {/* Buttons */}
          <div className='flex gap-3 justify-end items-center'>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className={`py-3 px-6 rounded-xl font-semibold text-[rgb(32,38,130)] bg-white border border-[rgb(32,38,130)] hover:bg-blue-50 transition-all duration-200 active:scale-[0.98] text-sm ${
                isDeleting ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className={`py-3 px-6 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-red-200 shadow-lg flex items-center justify-center gap-2 text-sm ${
                isDeleting ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {isDeleting ? (
                <>
                  <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
