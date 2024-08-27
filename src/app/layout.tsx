import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn, constructMetadata } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = constructMetadata()

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="h-full">
		<body
			className={cn(
				"relative h-full font-sans antialiased",
				inter.className
			)}>
			<main className="relative flex flex-col min-h-screen">
				<Providers>
					<Navbar />
					<div className="flex-grow flex-1">
						{children}
					</div>
					<Footer/>
				</Providers>
			</main>
			<Toaster position="top-center" richColors />
			<Analytics />
			<SpeedInsights />
		</body>
		</html>
	);
}
