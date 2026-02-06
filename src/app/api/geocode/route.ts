import { NextResponse } from "next/server";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { address, addresses } = body;

    if (!address && (!addresses || addresses.length === 0)) {
      return NextResponse.json(
        { error: "Address or addresses are required" },
        { status: 400 },
      );
    }

    if (!GOOGLE_MAPS_API_KEY) {
      return NextResponse.json(
        { error: "Google Maps API Key is missing" },
        { status: 500 },
      );
    }

    const locationsToGeocode = addresses || [address];
    const results = await Promise.all(
      locationsToGeocode.map(async (addr: string) => {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            addr,
          )}&key=${GOOGLE_MAPS_API_KEY}`,
        );
        const data = await response.json();

        if (data.status === "OK" && data.results && data.results[0]) {
          const location = data.results[0].geometry.location;
          return { lat: location.lat, lng: location.lng, address: addr };
        } else {
          console.warn(`Geocoding failed for ${addr}: ${data.status}`);
          return null;
        }
      }),
    );

    const validPositions = results.filter((pos) => pos !== null);

    return NextResponse.json({ positions: validPositions });
  } catch (error) {
    console.error("Geocoding API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
