import { privateProcedure, publicProcedure, router } from "./trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getPayloadClient } from "../get-payload";
import { stripe } from "../lib/stripe";
import Stripe from "stripe";

export const paymentRouter = router({
	// This procedure creates a new session for the user to check out
	createSession: privateProcedure
		.input(z.object({productIds: z.array(z.string())}))
		.mutation(async ({ctx, input}) => {
			const {user} = ctx
			let {productIds} = input

			if (productIds.length === 0) {
				throw new TRPCError({code: "BAD_REQUEST"})
			}

			const payload = await getPayloadClient()

			// Get the products from the database
			const {docs: products} = await payload.find({
				collection: "products",
				where: {
					id: {
						in: productIds,
					},
				}
			})

			const filteredProducts = products.filter((prod) => Boolean(prod.priceId))

			// Create a new order
			const order = await payload.create({
				collection: "orders",
				data: {
					_isPaid: false,
					// @ts-expect-error - TS doesn't know about type
					products: filteredProducts.map((prod) => prod.id),
					user: user.id,
				},
			})

			// Create the line items for the session
			const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []

			filteredProducts.forEach((product) => {
				if (typeof product.priceId === "string") {
					line_items.push({
						price: product.priceId!,
						quantity: 1,
					});
				} else {
					// If we get here, it means the product is missing a priceId
					throw new TRPCError({
						code: "BAD_REQUEST", message: "Invalid priceId"
					});
				}
			})

			line_items.push({
				price: "price_1PmYx9EjqhS8GKT3TJSfHbsJ",
				quantity: 1,
				adjustable_quantity: {
					enabled: false
				}
			})

			// Create the session
			try {
				const stripeSession =
					await stripe.checkout.sessions.create({
						success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
						cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
						payment_method_types: ["card",],
						mode: "payment",
						metadata: {
							userId: user.id,
							orderId: order.id,
						},
						line_items,
						payment_intent_data: {
							metadata: {
								userId: user.id,
								orderId: order.id
							}
						}
					})

				return {url: stripeSession.url}
			} catch (err) {
				console.log(err);

				return {url: null}
			}
		}),

	// This procedure is used to poll the status of an order

	pollOrderStatus: privateProcedure
		.input(z.object({orderId: z.string()}))
		.query(async ({input}) => {
			const {orderId} = input

			const payload = await getPayloadClient()

			const {docs: orders} = await payload.find({
				collection: "orders",
				where: {
					id: {
						equals: orderId,
					},
				},
			})

			if (!orders.length) {
				throw new TRPCError({code: "NOT_FOUND"})
			}

			const [order] = orders

			return {isPaid: order._isPaid}
		})
})