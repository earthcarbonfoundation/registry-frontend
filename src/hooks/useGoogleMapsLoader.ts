import { useJsApiLoader } from "@react-google-maps/api";

/**
 * Shared hook for Google Maps API loading
 * Ensures the API is loaded only once across the entire app
 * This prevents "Loader must not be called again with different options" errors
 */
export const useGoogleMapsLoader = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
    language: "en",
  });

  return { isLoaded, loadError };
};
