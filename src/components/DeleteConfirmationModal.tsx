import React from "react";
import CloseButtonIcon from "./svg/CloseButtonIcon";
import DeleteIcon from "./svg/DeleteIcon";

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
      className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex justify-center items-center z-[1000] p-4 transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[2rem] w-full max-w-sm shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden transform transition-all duration-300 scale-100 relative p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-500">
        
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-8">{message}</p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="py-3 px-4 rounded-xl font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="py-3 px-4 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-red-200 shadow-lg flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
