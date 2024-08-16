import express from "express";

export const stripeWebhookHandler = async (
	req: express.Request,
	res:express.Response
) => {
	// Verify the event by fetching it from Stripe

	// update the _isPaid field in the database

	// send receipt email to the customer
}