"use client";

import React, { useState, useEffect } from "react";
import PlusIcon from "./svg/PlusIcon";
import CloseButtonIcon from "./svg/CloseButtonIcon";
import DropDownIcon from "./svg/DropDownIcon";

declare global {
  interface Window {
    google: any;
  }
}
const google = typeof window !== "undefined" ? window.google : null;

const ACTION_TYPES = [
  { value: "solar_rooftop", label: "Solar Rooftop", unit: "kW" },
  { value: "swh", label: "Solar Water Heater", unit: "liters" },
  { value: "rwh", label: "Rainwater Harvesting", unit: "m³" },
  { value: "waterless_urinal", label: "Waterless Urinal", unit: "units" },
  {
    value: "wastewater_recycling",
    label: "Wastewater Recycling",
    unit: "m³/day",
  },
  { value: "biogas", label: "Biogas (Food Waste)", unit: "kg/day" },
  { value: "led_replacement", label: "LED Replacement", unit: "bulbs" },
  { value: "tree_plantation", label: "Tree Plantation", unit: "trees" },
];

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
  const [formData, setFormData] = useState({
    actionType: "",
    quantity: "",
    unit: "",
    address: "",
  });

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        actionType: initialData.actionType || "",
        quantity: initialData.quantity || "",
        unit: initialData.unit || "",
        address: initialData.address || "",
      });
    } else {
      setFormData({
        actionType: "",
        quantity: "",
        unit: "",
        address: "",
      });
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    if (formData.actionType) {
      const selectedType = ACTION_TYPES.find(
        (type) => type.value === formData.actionType,
      );
      if (selectedType) {
        setFormData((prev) => ({ ...prev, unit: selectedType.unit }));
      }
    }
  }, [formData.actionType]);

  const fetchSuggestions = (input: string) => {
    if (!input || typeof window === "undefined" || !window.google) {
      setSuggestions([]);
      return;
    }

    try {
      const google = window.google;
      const service = new google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        { input, types: ["(cities)"] },
        (predictions: any[] | null, status: any) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setSuggestions(predictions);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
          }
        },
      );
    } catch (e) {
      console.error("Google Maps Autocomplete Error:", e);
      setSuggestions([]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "address") {
      fetchSuggestions(value);
    }
  };

  const handleSelectSuggestion = (suggestion: any) => {
    setFormData((prev) => ({ ...prev, address: suggestion.description }));
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create a timeout promise to prevent indefinite hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timed out")), 15000);
      });

      // Race the submit against the timeout
      await Promise.race([onSubmit(formData), timeoutPromise]);

      setFormData({ actionType: "", quantity: "", unit: "", address: "" });
    } catch (error) {
      console.error("Submission error in modal:", error);
      // Constructive error handling is done by parent, but we catch here to prevent unhandled rejection
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/10 backdrop-blur-sm flex justify-center items-center z-[1000] p-4 transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[2rem] w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden transform transition-all duration-300 scale-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl hover:bg-gray-50 transition-colors text-gray-300 hover:text-gray-500 z-10"
        >
          <CloseButtonIcon />
        </button>

        <div className="px-8 pt-12 pb-10">
          <div className="mb-10 text-center">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 mx-auto mb-4 border border-gray-100/50">
              <PlusIcon />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 tracking-tight mb-2">
              Add New Action
            </h2>
            <p className="text-gray-400 text-sm font-medium">
              Record your environmental impact.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="actionType"
                className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1"
              >
                Action Type
              </label>
              <div className="relative">
                <select
                  id="actionType"
                  name="actionType"
                  className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-blue-400 transition-all duration-200 outline-none appearance-none font-medium text-gray-700 cursor-pointer"
                  value={formData.actionType}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled className="text-gray-400">
                    Select an action
                  </option>
                  {ACTION_TYPES.map((type) => (
                    <option
                      key={type.value}
                      value={type.value}
                      className="text-gray-700"
                    >
                      {type.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                  <DropDownIcon />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="quantity"
                  className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1"
                >
                  Quantity
                </label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-blue-400 transition-all duration-200 outline-none font-medium text-gray-700 placeholder:text-gray-300"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="unit"
                  className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1"
                >
                  Unit
                </label>
                <div className="w-full px-5 py-4 rounded-xl border border-gray-50 bg-gray-100/50 text-gray-400 font-bold flex items-center justify-center text-[10px] tracking-widest uppercase">
                  {formData.unit || "---"}
                </div>
              </div>
            </div>

            <div className="space-y-2 relative">
              <label
                htmlFor="address"
                className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1"
              >
                Address
              </label>
              <div className="relative group/input">
                <input
                  id="address"
                  name="address"
                  type="text"
                  className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-blue-400 transition-all duration-200 outline-none font-medium text-gray-700 placeholder:text-gray-300"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Start typing a city..."
                  required
                  autoComplete="off"
                />

                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-xl mt-2 shadow-xl z-[100] overflow-hidden max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion) => (
                      <div
                        key={suggestion.place_id}
                        className="px-5 py-3 hover:bg-gray-50 cursor-pointer transition-colors text-sm text-gray-600 border-b border-gray-50 last:border-0"
                        onClick={() => handleSelectSuggestion(suggestion)}
                      >
                        {suggestion.description}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <button
                type="button"
                className="flex-1 py-4 px-6 rounded-xl font-semibold text-gray-400 bg-white border border-gray-100 hover:bg-gray-50 transition-all duration-200 active:scale-[0.98] text-sm"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-[1.5] py-4 px-6 rounded-xl font-semibold text-white shadow-sm transition-all duration-200 text-sm flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-800 hover:bg-gray-900 hover:-translate-y-0.5 active:scale-[0.98]"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
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
