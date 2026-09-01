import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import LightRays from "@/components/LightRays";
import Navbar from "@/components/navbar";

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

const schibstedGrotesk = Schibsted_Grotesk({
    variable: "--font-schibsted-grotesk",
    subsets: ["latin"],
});

const martianMono = Martian_Mono({
    variable: "--font-martian-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "DevEvent",
    description: "The Hub for Every Dev Event You Mustn't Miss",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={cn(
                "min-h-screen",
                "h-full",
                "antialiased",
                schibstedGrotesk.variable,
                martianMono.variable,
                "font-mono",
                jetbrainsMono.variable
            )}
        >
        <body
            className={cn(
                schibstedGrotesk.variable,
                martianMono.variable,
                "min-h-full flex flex-col"
            )}
        >


        <Navbar />
        <div className="absolute inset-0 top-0 z-[-1] min-h-screen">
            <LightRays
                raysOrigin="top-center-offset"
                raysColor="#5dfeca"
                raysSpeed={0.5}
                lightSpread={0.5}
                rayLength={0.9}
                followMouse={true}
                mouseInfluence={0.02}
                noiseAmount={0.0}
                distortion={0.01}
                pulsating={false}
                fadeDistance={1}
                saturation={1}
            />
        </div>
        <main>{children}</main>
        </body>
        </html>
    );
}