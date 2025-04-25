const PaymentService = require("./payment.service");

class StripeService extends PaymentService {
  constructor() {
    super();
    this.baseUrl = process.env.PAYPAL_BASE_URL;
  }
  async generateAccessToken() {
    // Stripe doesn't require an access token for basic operations
    return null;
  }

  async createOrder(price) {
    // Implement Stripe-specific logic for creating an order
  }

  async capturePayment(orderId) {
    // Implement Stripe-specific logic for capturing a payment
  }
}

module.exports = StripeService;