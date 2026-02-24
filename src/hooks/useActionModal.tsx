"use client";

import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ACTION_TYPES } from "@/lib/constants";

declare global {
  interface Window {
    google: any;
  }
}

interface UseActionModalProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isOpen: boolean;
}

export const useActionModal = ({
  initialData,
  onSubmit,
  isOpen,
}: UseActionModalProps) => {
  const validationSchema = Yup.object().shape({
    actionType: Yup.string().required("Action type is required"),
    quantity: Yup.number()
      .min(0.01, "Quantity must be greater than 0")
      .required("Quantity is required")
      .typeError("Quantity must be a number"),
    unit: Yup.string().required("Unit is required"),
    address: Yup.string().required("Address is required"),
    lat: Yup.number().nullable(),
    lng: Yup.number().nullable(),
  });

  const formik = useFormik({
    initialValues: {
      actionType: "",
      quantity: "",
      unit: "",
      address: "",
      lat: null,
      lng: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Create a timeout promise to prevent indefinite hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Request timed out")), 15000);
        });

        await Promise.race([onSubmit(values), timeoutPromise]);

        // Reset form is handled by re-initialization on modal close/open usually,
        // but explicit reset is safer here if onSubmit succeeds
        formik.resetForm();
      } catch (error) {
        console.error("Submission error in modal:", error);
        throw error;
      }
    },
    enableReinitialize: true,
  });

  // Re-initialize with data or defaults when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        formik.setValues({
          actionType: initialData.actionType || "",
          quantity: initialData.quantity || "",
          unit: initialData.unit || "",
          address: initialData.address || "",
          lat: initialData.lat || null,
          lng: initialData.lng || null,
        });
      } else {
        formik.resetForm();
      }
    }
  }, [initialData, isOpen]);

  // Update unit when action type changes
  useEffect(() => {
    if (formik.values.actionType) {
      const selectedType = ACTION_TYPES.find(
        (type) => type.value === formik.values.actionType,
      );
      if (selectedType && selectedType.unit !== formik.values.unit) {
        formik.setFieldValue("unit", selectedType.unit);
      }
    }
  }, [formik.values.actionType]);

  return {
    formik,
    ACTION_TYPES,
  };
};

/* Re-export for backward compatibility */
export { ACTION_TYPES };
