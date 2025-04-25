class PaymentFactory {
  constructor({ paypalService, stripeService }) {
    this.paypalService = paypalService;
    this.stripeService = stripeService;

  }

  getPaymentService(provider) {
    switch (provider) {
      case "paypal":
        return this.paypalService;
      case "stripe":
        return this.stripeService;
      // case "fawry":
      //   return this.fawryService;
      default:
        throw new Error("Unsupported payment provider");
    }
  }
}

module.exports = PaymentFactory;