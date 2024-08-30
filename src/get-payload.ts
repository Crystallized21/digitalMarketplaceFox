import dotenv from 'dotenv';
import path from "path";
import payload, {Payload} from 'payload';
import {InitOptions} from "payload/config";
import nodemailer from 'nodemailer';

// Load environment variables

dotenv.config({
    path: path.resolve(__dirname, "../.env")
});

// Create a nodemailer transporter

const transporter = nodemailer.createTransport({
    host: "smtp.resend.com",
    secure: true,
    port: 465,
    auth: {
        user: "resend",
        pass: process.env.RESEND_API_KEY
    }
})

// Create a cache object to store the client and promise

let cached = (global as any).payload

if (!cached) {
    cached = (global as any).payload = {
        client: null,
        promise: null,
    }
}

interface Args {
    initOptions?: Partial<InitOptions>
}

// Get the Payload client

export const getPayloadClient = async ({
    initOptions,
}: Args = {}): Promise<Payload> => {
    if (!process.env.PAYLOAD_SECRET) {
        throw new Error("PAYLOAD_SECRET_KEY is missing")
    }

    if (cached.client) {
        return cached.client
    }

    if (!cached.promise) {
        cached.promise = payload.init({
            email: {
                transport: transporter,
                fromAddress: "onboarding@resend.dev",
                fromName: "DigitalFox",
            },
            secret: process.env.PAYLOAD_SECRET,
            local: !initOptions?.express,
            ...(initOptions || {}),
        })
    }

    try {
        cached.client = await cached.promise
    } catch (e: unknown) {
        cached.promise = null
        throw e
    }

    return cached.client
}
