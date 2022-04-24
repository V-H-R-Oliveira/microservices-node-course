/* eslint-disable @typescript-eslint/no-non-null-assertion */
import process from "process"
import Stripe from "stripe"

export const stripeClient = new Stripe(process.env.STRIPE_KEY!, {
    apiVersion: "2020-08-27"
})