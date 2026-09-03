import { Schema, model, models, Document, Types, Model } from 'mongoose';
import Event from './event.model';

// TypeScript interface for Booking document
export interface IBooking extends Document {
    eventId: Types.ObjectId;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
    {
        eventId: {
            type: Schema.Types.ObjectId,
            ref: 'Event',
            required: [true, 'Event ID is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            validate: {
                validator: function (email: string) {
                    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
                    return emailRegex.test(email);
                },
                message: 'Please provide a valid email address',
            },
        },
    },
    {
        timestamps: true, // Auto-generate createdAt and updatedAt
    }
);

// Pre-save hook to validate event exists before creating booking
BookingSchema.pre('save', async function () {
    const booking = this as IBooking;

    if (booking.isModified('eventId') || booking.isNew) {
        const eventExists = await Event.findById(booking.eventId).select('_id');

        if (!eventExists) {
            throw new Error(`Event with ID ${booking.eventId} does not exist`);
        }
    }
});

// Create index on eventId for faster queries
BookingSchema.index({ eventId: 1 });

// Create compound index for common queries (event bookings by date)
BookingSchema.index({ eventId: 1, createdAt: -1 });

// Create index on email for user booking lookups
BookingSchema.index({ email: 1 });

// Enforce one booking per event per email
BookingSchema.index({ eventId: 1, email: 1 }, { unique: true, name: 'uniq_event_email' });

const Booking: Model<IBooking> =
    (models.Booking as Model<IBooking>) || model<IBooking>('Booking', BookingSchema);

export default Booking;