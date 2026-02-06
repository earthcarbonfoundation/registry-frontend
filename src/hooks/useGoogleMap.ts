import { useState, useEffect, useCallback } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

interface UseGoogleMapProps {
  address?: string;
  locations?: { address: string }[];
}

const libraries: "places"[] = ["places"];

export const useGoogleMap = ({ address, locations }: UseGoogleMapProps) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
    language: "en",
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.LatLngLiteral[]>([]);
  const [center, setCenter] = useState<google.maps.LatLngLiteral | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  useEffect(() => {
    const fetchCoordinates = async () => {
      // Determine what to fetch
      let payload = {};
      
      const hasLocations = locations && locations.length > 0;
      
      if (hasLocations) {
         const addresses = locations.map(l => l.address).filter(Boolean);
         if(addresses.length === 0) return;
         payload = { addresses };
      } else if (address) {
        payload = { address };
      } else {
        setCenter(null);
        setMarkers([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/geocode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch coordinates");
        }

        const positions = data.positions;

        if (positions && positions.length > 0) {
           // Simplify positions for the map (just lat/lng)
           const mapPositions = positions.map((p: any) => ({ lat: p.lat, lng: p.lng }));
           
           setMarkers(mapPositions);
           
           if(mapPositions.length === 1) {
             setCenter(mapPositions[0]);
             if(map) {
                map.panTo(mapPositions[0]);
                map.setZoom(12);
             }
           } else if (map) {
             // Multi-marker fit bounds
             // We need to wait for the map to be ready and Google API to be loaded
             if(window.google) {
                const bounds = new window.google.maps.LatLngBounds();
                mapPositions.forEach((pos: google.maps.LatLngLiteral) => bounds.extend(pos));
                map.fitBounds(bounds);
             }
           }
           // Use the first result as center if multiple, just to have a default center
           if(mapPositions.length > 1 && !center){
               setCenter(mapPositions[0]);
           }

        } else {
             // No valid positions found
             if(address) setError("Unable to locate address");
        }

      } catch (err: any) {
        console.error("Error fetching map coordinates:", err);
        setError(err.message || "Error loading map data");
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) {
      fetchCoordinates();
    }
  }, [address, locations, isLoaded, map]);

  return {
    isLoaded,
    loadError,
    map,
    markers,
    center,
    loading,
    error,
    onLoad,
    onUnmount,
  };
};
