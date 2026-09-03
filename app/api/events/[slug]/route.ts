import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Event, { IEvent } from "@/database/event.model";

// Shape of the dynamic route params for this endpoint
interface RouteParams {
    params: Promise<{ slug: string }>;
}

// Basic slug validation: non-empty, URL-safe (letters, numbers, hyphens)
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;

function isValidSlug(slug: unknown): slug is string {
    return typeof slug === "string" && slug.trim().length > 0 && SLUG_REGEX.test(slug);
}

export async function GET(
    req: NextRequest,
    { params }: RouteParams
): Promise<NextResponse> {
    try {
        const { slug } = await params;

        // Validate slug before touching the database
        if (!isValidSlug(slug)) {
            return NextResponse.json(
                { message: "Invalid or missing 'slug' parameter" },
                { status: 400 }
            );
        }

        await connectToDatabase();



        const event = await Event.findOne({ slug }).lean<IEvent | null>();

        if (!event) {
            return NextResponse.json(
                { message: `No event found with slug '${slug}'` },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Event fetched successfully", event },
            { status: 200 }
        );

    } catch (error) {
        // Catch-all for unexpected errors (DB connection issues, etc.)
        console.error("GET /api/events/[slug] error:", error);

        return NextResponse.json(
            {
                message: "Failed to fetch event",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}