import { privateProcedure, router } from "@/trpc/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getPayloadClient } from "../get-payload";
import { stripe } from "../lib/stripe";
import Stripe from "stripe";

export const paymentRouter = router({
	createSession: privateProcedure
		.input(z.object({productIds: z.array(z.string())}))
		.mutation(async ({ctx, input}) => {
			const {user} = ctx
			let {productIds} = input

			if (productIds.length === 0) {
				throw new TRPCError({code: "BAD_REQUEST"})
			}

			const payload = await getPayloadClient()

			const {docs: products} = await payload.find({
				collection: "products",
				where: {
					id: {
						in: productIds,
					},
				}
			})

			const filteredProducts = products.filter((prod) => Boolean(prod.priceId))

			const order = await payload.create({
				collection: "orders",
				data: {
					_isPaid: false,
					// @ts-expect-error - TS doesn't know about type
					products: filteredProducts,
					user: user.id,
				},
			})

			const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
				[]

			filteredProducts.forEach((product) => {
				line_items.push({
					price: product.priceId!,
					quantity: 1,
				})
			})

			line_items.push({
				price: "price_1PmYx9EjqhS8GKT3TJSfHbsJ",
				quantity: 1,
				adjustable_quantity: {
					enabled: false
				}
			})

			try {
				const stripeSession =
					await stripe.checkout.sessions.create({
						success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
						cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
						payment_method_types: ["card", "paypal"],
						mode: "payment",
						line_items: line_items,
						metadata: {
							userId: user.id,
							orderId: order.id,
						}
					})
			} catch (err) {

			}
		}),
})