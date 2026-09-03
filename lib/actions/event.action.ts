'use server';
import Event from '@/database/event.model';
import { connectToDatabase } from "@/lib/mongodb";

export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectToDatabase();

        const event = await Event.findOne({ slug }).lean();

        if (!event) return [];

        const similarEvents = await Event.find({
            _id: { $ne: event._id },
            tags: { $in: event.tags },
        }).lean();

        // Convert to plain, serializable objects (strips ObjectId, Dates, etc. into JSON-safe values)
        return JSON.parse(JSON.stringify(similarEvents));

    } catch {
        return [];
    }
}