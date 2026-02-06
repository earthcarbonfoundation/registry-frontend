import React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useGoogleMap } from "@/hooks/useGoogleMap";
import NoLocationIcon from "./svg/NoLocationIcon";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "1rem",
};

interface GoogleMapViewProps {
  address?: string;
  locations?: { address: string }[];
}

function GoogleMapView({ address, locations }: GoogleMapViewProps) {
  const {
    isLoaded,
    loadError,
    map,
    markers,
    center,
    loading,
    error,
    onLoad,
    onUnmount,
  } = useGoogleMap({ address, locations });

  if (loadError) {
    return (
      <div className="w-full h-[400px] bg-red-50 rounded-[1.5rem] mt-6 flex items-center justify-center text-red-400 border border-red-100">
        Error loading Google Maps API
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[400px] bg-gray-100 rounded-[1.5rem] mt-6 flex items-center justify-center text-gray-400">
        Loading API...
      </div>
    );
  }

  // Show loading state while fetching coordinates
  if (loading && !center) {
    return (
      <div className="w-full h-[400px] bg-gray-100 rounded-[1.5rem] mt-6 flex items-center justify-center text-gray-400">
        Finding location...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[400px] bg-red-50 rounded-[1.5rem] mt-6 flex items-center justify-center text-red-500 border border-red-100">
        {error}
      </div>
    );
  }

  if (!center && markers.length === 0) {
    return (
      <div className="w-full h-[400px] bg-gray-50 rounded-[1.5rem] mt-6 flex flex-col items-center justify-center text-gray-400 gap-2 border-2 border-dashed border-gray-200">
        <NoLocationIcon />
        <span>No location data found</span>
      </div>
    );
  }

  return (
    <div className="w-full mt-6 bg-white p-2 rounded-[1.5rem] border border-gray-100 shadow-sm">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center || { lat: 0, lng: 0 }}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {markers.map((pos, idx) => (
          <Marker key={idx} position={pos} />
        ))}
      </GoogleMap>
    </div>
  );
}

export default React.memo(GoogleMapView);
