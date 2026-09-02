import {
    Schema,
    model,
    models,
    Types,
    type Model,
    type Document,
    type HydratedDocument,
} from "mongoose";
import { Event } from "./event.model";

// Shape of a Booking document
export interface IBooking extends Document {
    eventId: Types.ObjectId;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bookingSchema = new Schema<IBooking>(
    {
        eventId: {
            type: Schema.Types.ObjectId,
            ref: "Event",
            required: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            validate: {
                validator: (value: string) => EMAIL_REGEX.test(value),
                message: "Invalid email format.",
            },
        },
    },
    { timestamps: true }
);

// Ensure the referenced event actually exists before saving a booking
bookingSchema.pre("save", async function (this: HydratedDocument<IBooking>) {
    if (this.isModified("eventId")) {
        const eventExists = await Event.exists({ _id: this.eventId });
        if (!eventExists) {
            throw new Error(`Event with id "${this.eventId}" does not exist.`);
        }
    }
});

export const Booking: Model<IBooking> =
    (models.Booking as Model<IBooking>) ||
    model<IBooking>("Booking", bookingSchema);