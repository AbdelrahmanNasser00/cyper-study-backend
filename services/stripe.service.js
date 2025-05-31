const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
class StripeService {
  async createOrder(amount, orderId) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Course Order #${orderId}`,
            },
            unit_amount: Math.round(amount * 100), // cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-cancel?order_id=${orderId}`,
      metadata: {
        orderId,
      },
    });

    return {
      approvalUrl: session.url, // Stripe Checkout URL
      Token: session.id, // Session ID
    };
  }

  async capturePayment(sessionId) {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return { status: "PENDING" };
    }

    return {
      status: "COMPLETED",
      paymentIntent: session.payment_intent,
    };
  }
}

module.exports = StripeService;
