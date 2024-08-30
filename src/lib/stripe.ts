import Stripe from "stripe"

// Create a new instance of the Stripe SDK with your Stripe secret key

export const stripe = new Stripe(
	process.env.STRIPE_SECRET_KEY ?? "",
	{
		apiVersion: "2024-06-20",
		typescript: true,
	}
)