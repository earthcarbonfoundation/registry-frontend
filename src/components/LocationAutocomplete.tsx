import React from "react";
import { useLocationAutocomplete } from "../hooks/useLocationAutocomplete";

interface LocationAutocompleteProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPlaceSelect?: (location: any) => void;
  error?: any;
  fallbackErrorMessage?: string;
}

const LocationAutocomplete = ({
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Search location...",
  className = "",
  error,
  fallbackErrorMessage = "Please select a location from the dropdown suggestions",
  ...props
}: LocationAutocompleteProps) => {
  const {
    inputRef,
    inputValue,
    isValidSelection,
    handleInputChange,
    handleInputBlur,
    isLoaded,
    loadError,
  } = useLocationAutocomplete({ value, onChange, onPlaceSelect });

  if (loadError) {
    return (
      <input
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Error loading location search"
        className={`w-full px-5 py-4 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-blue-400 transition-all duration-200 outline-none font-medium text-gray-700 placeholder:text-gray-300 ${className}`}
      />
    );
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        className={`w-full px-5 py-4 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-blue-400 transition-all duration-200 outline-none font-medium text-gray-700 placeholder:text-gray-300 ${className} ${(!isValidSelection && inputValue.trim() !== "") || error ? "border-red-500" : ""}`}
        {...props}
      />
      {((!isValidSelection && inputValue.trim() !== "") || error) && (
        <div className="mt-1 text-xs text-red-500">
          {error || fallbackErrorMessage}
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;
