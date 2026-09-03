import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import Event from "@/database/event.model";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!;
const API_KEY = process.env.CLOUDINARY_API_KEY!;
const API_SECRET = process.env.CLOUDINARY_API_SECRET!;

function generateSignature(params: Record<string, string>, apiSecret: string) {
    const sorted = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
    return crypto.createHash('sha1').update(sorted + apiSecret).digest('hex');
}

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        const formData = await req.formData();
        const eventData: Record<string, unknown> = {};

        for (const [key, value] of formData.entries()) {
            if (key === "agenda" || key === "tags") {
                eventData[key] = (value as string).split(",").map((item) => item.trim());
            } else {
                eventData[key] = value;
            }
        }

        const file = formData.get('image') as File;
        if (!file) return NextResponse.json({ message: 'Image file is required' }, { status: 400 });

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        console.log("File info:", { name: file.name, type: file.type, size: buffer.length });
        console.log("Starting direct Cloudinary upload (bypassing SDK)...");

        const timestamp = Math.floor(Date.now() / 1000).toString();
        const folder = "DevEvent";
        const signature = generateSignature({ folder, timestamp }, API_SECRET);

        const form = new FormData();
        form.append('file', buffer, { filename: file.name, contentType: file.type });
        form.append('api_key', API_KEY);
        form.append('timestamp', timestamp);
        form.append('folder', folder);
        form.append('signature', signature);

        const contentLength = await new Promise<number>((resolve, reject) => {
            form.getLength((err, length) => {
                if (err) return reject(err);
                resolve(length);
            });
        });

        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            form,
            {
                headers: {
                    ...form.getHeaders(),
                    'Content-Length': contentLength,
                },
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
            }
        );

        console.log("Cloudinary upload success:", response.data.secure_url);
        eventData.image = response.data.secure_url;

        const createdEvent = await Event.create(eventData);

        return NextResponse.json(
            { message: "Event created successfully", event: createdEvent },
            { status: 201 }
        );

    } catch (e) {
        console.error("FULL ERROR:", e);
        if (axios.isAxiosError(e)) {
            console.error("Axios error response:", JSON.stringify(e.response?.data, null, 2));
            console.error("Axios error status:", e.response?.status);
        }
        return NextResponse.json(
            { message: "Event Creation Failed", error: e instanceof Error ? e.message : JSON.stringify(e) },
            { status: 400 }
        );
    }
}

export async function GET() {
    try {
        await connectToDatabase();

        const events = await Event.find().sort({ createdAt: -1 });

        return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: 'Event fetching failed', error: e }, { status: 500 });
    }
}