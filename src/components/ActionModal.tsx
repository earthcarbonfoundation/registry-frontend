"use client";

import React from "react";
import CloseButtonIcon from "./svg/CloseButtonIcon";
import DropDownIcon from "./svg/DropDownIcon";
import { useActionModal, ACTION_TYPES } from "../hooks/useActionModal";
import LocationAutocomplete from "./LocationAutocomplete";

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
}

const ActionModal: React.FC<ActionModalProps & { initialData?: any }> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  initialData,
}) => {
  const { formik } = useActionModal({ initialData, onSubmit, isOpen });

  const handlePlaceSelect = (location: any) => {
    formik.setFieldValue("address", location.address);
    if (location.lat && location.lng) {
      formik.setFieldValue("lat", location.lat);
      formik.setFieldValue("lng", location.lng);
    }
  };

  if (!isOpen) return null;

  const isEditMode = !!initialData;

  return (
    <div
      className='fixed inset-0 bg-gray-900/10 backdrop-blur-sm flex justify-center items-center z-[1000] p-4 transition-all duration-300'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-[2rem] w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-100 duration-300 scale-100 relative max-h-[90vh] '
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Title and Close Button */}
        <div className='flex items-center justify-between px-8 pt-8 pb-6 border-b border-gray-100'>
          <h2 className='text-xl font-semibold text-gray-800 tracking-tight'>
            {isEditMode ? "Edit Action" : "Add New Action"}
          </h2>
          <button
            onClick={onClose}
            className='p-2 rounded-xl hover:bg-gray-50 transition-colors text-gray-300 hover:text-gray-500 cursor-pointer'
          >
            <CloseButtonIcon />
          </button>
        </div>

        <div className='px-8 pt-8 pb-10'>
          <form onSubmit={formik.handleSubmit} className='space-y-6'>
            <div className='space-y-2'>
              <label
                htmlFor='actionType'
                className='block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1'
              >
                Action Type
              </label>
              <div className='relative'>
                <select
                  id='actionType'
                  name='actionType'
                  className={`w-full px-5 py-4 rounded-xl border bg-gray-50/50 focus:bg-white transition-all duration-200 outline-none appearance-none font-medium text-gray-700 cursor-pointer ${
                    formik.touched.actionType && formik.errors.actionType
                      ? "border-red-400 focus:border-red-400"
                      : "border-gray-100 focus:border-blue-400"
                  }`}
                  value={formik.values.actionType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value='' disabled className='text-gray-400'>
                    Select an action
                  </option>
                  {ACTION_TYPES.map((type) => (
                    <option
                      key={type.value}
                      value={type.value}
                      className='text-gray-700'
                    >
                      {type.label}
                    </option>
                  ))}
                </select>
                <div className='absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300'>
                  <DropDownIcon />
                </div>
              </div>
              {formik.touched.actionType && formik.errors.actionType && (
                <div className='text-red-500 text-xs ml-1'>
                  {formik.errors.actionType}
                </div>
              )}
            </div>

            <div className='space-y-2'>
              <label
                htmlFor='quantity'
                className='block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1'
              >
                Quantity
              </label>
              <div className='relative'>
                <input
                  id='quantity'
                  name='quantity'
                  type='number'
                  className={`w-full px-5 py-4 pr-32 rounded-xl border bg-gray-50/50 focus:bg-white transition-all duration-200 outline-none font-medium text-gray-700 placeholder:text-gray-300 ${
                    formik.touched.quantity && formik.errors.quantity
                      ? "border-red-400 focus:border-red-400"
                      : "border-gray-100 focus:border-blue-400"
                  }`}
                  value={formik.values.quantity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder='0.00'
                  step='0.01'
                />
                <div className='absolute right-5 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-100/50 rounded-lg text-gray-500 font-bold text-sm pointer-events-none'>
                  {formik.values.unit || "units"}
                </div>
              </div>
              {formik.touched.quantity && formik.errors.quantity && (
                <div className='text-red-500 text-xs ml-1'>
                  {formik.errors.quantity}
                </div>
              )}
            </div>

            <div className='space-y-2 relative'>
              <label
                htmlFor='address'
                className='block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1'
              >
                Address
              </label>
              <div className='relative group/input'>
                <LocationAutocomplete
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onPlaceSelect={handlePlaceSelect}
                  placeholder='Start typing an address...'
                  name='address'
                  error={formik.touched.address && formik.errors.address}
                />
              </div>
            </div>

            {/* Google Map View */}

            <div className='flex gap-3 pt-6 justify-end items-center'>
              <button
                type='button'
                className='py-3 px-6 rounded-xl font-semibold text-[rgb(32,38,130)] bg-white border border-[rgb(32,38,130)] hover:bg-blue-50 transition-all duration-200 active:scale-[0.98] text-sm cursor-pointer'
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={isSubmitting}
                className={`py-3 px-6 rounded-xl font-semibold text-white shadow-sm transition-all duration-200 text-sm flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[rgb(32,38,130)] hover:bg-[rgb(25,30,110)] hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                    {isEditMode ? "Updating..." : "Submitting..."}
                  </>
                ) : isEditMode ? (
                  "Update"
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
