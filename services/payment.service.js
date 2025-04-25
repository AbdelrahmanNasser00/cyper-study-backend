class PaymentService {
  constructor() {
    if (this.constructor === PaymentService) {
      throw new Error("Abstract classes can't be instantiated.");
    }
  }

  async generateAccessToken() {
    throw new Error("Method 'generateAccessToken()' must be implemented.");
  }

  async createOrder(price) {
    throw new Error("Method 'createOrder()' must be implemented.");
  }

  async capturePayment(orderId) {
    throw new Error("Method 'capturePayment()' must be implemented.");
  }
}

module.exports = PaymentService;