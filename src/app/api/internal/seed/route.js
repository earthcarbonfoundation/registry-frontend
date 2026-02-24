import { NextResponse } from "next/server";
import { runSeed } from "../../../../../src/scripts/seed";

export async function POST(request) {
    try {
        const seedKey = request.headers.get("X-Seed-Key");
        if (seedKey !== process.env.SEED_KEY) {
            return NextResponse.json({ message: "Invalid seed key" }, { status: 401 });
        }

        const result = await runSeed();
        return NextResponse.json({ message: "Seed completed successfully", result }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error seeding database", error: error.message }, { status: 500 });
    }
}