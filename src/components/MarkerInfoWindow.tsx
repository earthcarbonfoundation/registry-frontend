import React from "react";
import { ACTION_TYPES } from "@/hooks/useActionModal";

interface MarkerInfoWindowProps {
  data: any;
  onClose?: () => void;
}

export const MarkerInfoWindow: React.FC<MarkerInfoWindowProps> = ({
  data,
  onClose,
}) => {
  const formatDate = (timestamp: any): string => {
    if (!timestamp?.seconds) return "N/A";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getActionLabel = (actionType: string): string => {
    const action = ACTION_TYPES.find((a) => a.value === actionType);
    return action?.label || actionType;
  };

  const getActionUnit = (actionType: string): string => {
    const action = ACTION_TYPES.find((a) => a.value === actionType);
    return action?.unit || "units";
  };

  if (!data) {
    return (
      <div className='px-4 py-3 text-sm text-gray-600'>
        Location information unavailable
      </div>
    );
  }

  return (
    <div className='w-70 bg-green-50 rounded-lg shadow-lg border border-green-100'>
      {/* Header with Close Button and Action Type */}
      <div className='flex items-center gap-2 p-2 border-b border-green-200'>
        <div className='flex items-center gap-2 flex-1'>
          <div className='text-green-600 shrink-0'>
            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-xs font-semibold text-green-600 uppercase tracking-wide'>
              Action
            </p>
            <h3 className='text-sm font-bold text-gray-800 truncate'>
              {getActionLabel(data.actionType)}
            </h3>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className='shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-200 hover:bg-green-300 text-green-700 hover:text-green-800 transition-colors'
            aria-label='Close'
          >
            <svg
              className='w-3 h-3'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2.5}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        )}
      </div>

      {/* Quantity, Unit & Summary Row */}
      <div className='bg-white rounded-lg p-1.5 mx-2 my-2 border border-green-200'>
        <div className='flex items-end gap-2'>
          <div>
            <p className='text-xs text-gray-600 font-semibold mb-0.5'>SAVED</p>
            <div className='flex items-baseline gap-0.5'>
              <span className='text-lg font-bold text-green-600'>
                {data.quantity || 0}
              </span>
              <span className='text-xs font-semibold text-gray-700'>
                {getActionUnit(data.actionType)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Location */}
      {data.address && (
        <div className='px-2 mb-1 text-xs'>
          <p className='text-gray-600 font-semibold mb-0.5'>📍 Location</p>
          <p className='text-gray-700 leading-tight'>{data.address}</p>
        </div>
      )}

      {/* Date */}
      {data.createdAt && (
        <div className='text-xs text-gray-500 text-center py-2 px-2 border-t border-green-200'>
          {formatDate(data.createdAt)}
        </div>
      )}
    </div>
  );
};

export default MarkerInfoWindow;
