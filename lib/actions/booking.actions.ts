'use server';

import Booking from '@/database/booking.model';
import { connectToDatabase } from "@/lib/mongodb";

const createBooking = async ({ eventId, email }: { eventId: string; email: string; }) => {
    try {
        await connectToDatabase();

        const booking = await Booking.create({ eventId, email });

        return { success: true, booking: JSON.parse(JSON.stringify(booking)) };

    } catch (e) {
        console.error('create booking failed', e);
        return { success: false, error: e instanceof Error ? e.message : "Unknown error" };
    }
}
export default createBooking