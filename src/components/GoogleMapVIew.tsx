import React, { useState, useMemo } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { useGoogleMapsLoader } from "@/hooks/useGoogleMapsLoader";
import { ACTION_LABELS } from "@/lib/constants";
import NoLocationIcon from "./svg/NoLocationIcon";
import MarkerInfoWindow from "./MarkerInfoWindow";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "1rem",
};

interface GoogleMapViewProps {
  locations?: any[];
}

function GoogleMapView({ locations }: GoogleMapViewProps) {
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState<number | null>(
    null,
  );

  // Use shared Google Maps loader to prevent multiple initialization conflicts
  const { isLoaded, loadError } = useGoogleMapsLoader();

  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Calculate markers and center directly from locations array
  const { markers, center } = useMemo(() => {
    if (!locations || locations.length === 0) {
      return { markers: [], center: null };
    }

    // Extract lat/lng from locations (already provided by Firebase)
    const markerData = locations.map((loc: any) => ({
      position: { lat: loc.lat, lng: loc.lng },
      data: loc,
    }));

    // Use first location as center
    const mapCenter = {
      lat: markerData[0].position.lat,
      lng: markerData[0].position.lng,
    };

    // Fit bounds for multiple markers
    if (markerData.length > 1 && map && window.google) {
      const bounds = new window.google.maps.LatLngBounds();
      markerData.forEach((m: any) => bounds.extend(m.position));
      setTimeout(() => map.fitBounds(bounds), 0);
    }

    return { markers: markerData, center: mapCenter };
  }, [locations, map]);

  const onLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  const onUnmount = () => {
    setMap(null);
  };

  const formatValue = (value: any, key: string): string => {
    if (value === null || value === undefined) return "N/A";

    // Handle timestamps
    if (key === "createdAt" && value?.seconds) {
      const date = new Date(value.seconds * 1000);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    }

    // Handle numbers
    if (typeof value === "number") return value.toString();

    return value.toString();
  };

  const getActionLabel = (actionType: string): string => {
    return ACTION_LABELS[actionType] || actionType;
  };

  if (loadError) {
    return (
      <div className='w-full h-[400px] bg-red-50 rounded-[1.5rem] mt-6 flex items-center justify-center text-red-400 border border-red-100'>
        Error loading Google Maps API
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className='w-full h-[400px] bg-gray-100 rounded-[1.5rem] mt-6 flex items-center justify-center text-gray-400'>
        Loading map...
      </div>
    );
  }

  if (!center && markers.length === 0) {
    return (
      <div className='w-full h-[400px] bg-gray-50 rounded-[1.5rem] mt-6 flex flex-col items-center justify-center text-gray-400 gap-2 border-2 border-dashed border-gray-200'>
        <NoLocationIcon />
        <span>No location data found</span>
      </div>
    );
  }

  return (
    <div className='w-full mt-6 bg-white p-2 rounded-[1.5rem] border border-gray-100 shadow-sm'>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center || { lat: 0, lng: 0 }}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {markers.map((markerData, idx) => (
          <Marker
            key={idx}
            position={markerData.position}
            onClick={() => setSelectedMarkerIndex(idx)}
          />
        ))}

        {selectedMarkerIndex !== null && markers[selectedMarkerIndex] && (
          <InfoWindow
            position={markers[selectedMarkerIndex].position}
            onCloseClick={() => setSelectedMarkerIndex(null)}
            options={
              {
                closeBoxURL: "",
                headerDisabled: true,
              } as unknown as google.maps.InfoWindowOptions
            }
          >
            <MarkerInfoWindow
              data={markers[selectedMarkerIndex].data}
              onClose={() => setSelectedMarkerIndex(null)}
            />
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

export default React.memo(GoogleMapView);
