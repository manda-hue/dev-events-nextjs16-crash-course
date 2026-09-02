import {
    Schema,
    model,
    models,
    type Model,
    type Document,
    type HydratedDocument,
} from "mongoose";

// Shape of an Event document
export interface IEvent extends Document {
    title: string;
    slug: string;
    description: string;
    overview: string;
    image: string;
    venue: string;
    location: string;
    date: string;
    time: string;
    mode: "online" | "offline" | "hybrid";
    audience: string;
    agenda: string[];
    organizer: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, unique: true, index: true },
        description: { type: String, required: true, trim: true },
        overview: { type: String, required: true, trim: true },
        image: { type: String, required: true, trim: true },
        venue: { type: String, required: true, trim: true },
        location: { type: String, required: true, trim: true },
        date: { type: String, required: true },
        time: { type: String, required: true },
        mode: {
            type: String,
            enum: ["online", "offline", "hybrid"],
            required: true,
        },
        audience: { type: String, required: true, trim: true },
        agenda: {
            type: [String],
            required: true,
            validate: {
                validator: (arr: string[]) => Array.isArray(arr) && arr.length > 0,
                message: "Agenda must contain at least one item.",
            },
        },
        organizer: { type: String, required: true, trim: true },
        tags: {
            type: [String],
            required: true,
            validate: {
                validator: (arr: string[]) => Array.isArray(arr) && arr.length > 0,
                message: "Tags must contain at least one item.",
            },
        },
    },
    { timestamps: true }
);

// Generate a URL-friendly slug from a title (lowercase, hyphenated, no special chars)
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

// Normalize a date string to ISO format (YYYY-MM-DD)
function normalizeDate(date: string): string {
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
        throw new Error(`Invalid date value: "${date}"`);
    }
    return parsed.toISOString().split("T")[0];
}

// Normalize a time string to HH:mm (24-hour) format
function normalizeTime(time: string): string {
    const match = time.trim().match(/^(\d{1,2}):(\d{2})/);
    if (!match) {
        throw new Error(`Invalid time value: "${time}"`);
    }
    const hours = match[1].padStart(2, "0");
    const minutes = match[2];
    return `${hours}:${minutes}`;
}

// Auto-generate slug and normalize date/time before validation runs
eventSchema.pre("validate", async function (this: HydratedDocument<IEvent>) {
    if (this.isModified("title")) {
        this.slug = generateSlug(this.title);
    }

    if (this.isModified("date")) {
        this.date = normalizeDate(this.date);
    }

    if (this.isModified("time")) {
        this.time = normalizeTime(this.time);
    }
});

export const Event: Model<IEvent> =
    (models.Event as Model<IEvent>) || model<IEvent>("Event", eventSchema);