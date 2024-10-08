import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Metadata } from "next";

// This function is used to merge classnames

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// This function is used to format prices

export function formatPrice(
    price: number | string,
    options: {
      currency?: "USD" | "EUR" | "GBP" | "BDP",
      notation?: Intl.NumberFormatOptions["notation"],
    } = {}
) {
  const {currency = "USD", notation = "compact"} = options

  const numericPrice = typeof price === "string" ? parseFloat(price) : price

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(numericPrice)
}

// This function is used to construct metadata

export function constructMetadata({
    title = 'DigitalFox - the marketplace for digital assets',
    description = 'DigitalFox is an open-source marketplace for high-quality digital goods.',
    image = '/thumbnail.jpg',
    icons = '/favicon.ico',
    noIndex = false,
}: {
    title?: string
    description?: string
    image?: string
    icons?: string
    noIndex?: boolean
} = {}): Metadata {
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [
                {
                    url: image,
                },
            ],
        },
        icons,
        metadataBase: new URL('https://digitalhippo.up.railway.app'),
        ...(noIndex && {
            robots: {
                index: false,
                follow: false,
            },
        }),
    }
}