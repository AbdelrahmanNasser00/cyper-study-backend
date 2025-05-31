class EnrollmentController {
  constructor(enrollmentService) {
    if (!enrollmentService) {
      console.error("EnrollmentService is undefined!");
    }
    this.enrollmentService = enrollmentService;
  }

  // Create an order
  createOrder = async (req, res, next) => {
    try {
      const { courseIds, coupons, provider } = req.body; // provider: "paypal", "stripe", "fawry"
      const userId = req.user.id;

      const { approvalUrl, orderId } = await this.enrollmentService.enroll(
        userId,
        courseIds,
        coupons,
        provider
      );
      res.status(201).json({ message: "Order created", approvalUrl, orderId });
    } catch (error) {
      console.error("Error creating order:", error.message);
      next(error);
    }
  };

  // Complete an order
  completeOrder = async (req, res, next) => {
    try {
      const { token, session_id } = req.query;
      let paymentToken = token || session_id; // For PayPal

      const orderDetails =
        await this.enrollmentService.completeOrder(paymentToken);
      console.log(orderDetails);

      return res.redirect(
        `http://localhost:5173/payment-success?status=success&order_id=${orderDetails.id}`
      );
    } catch (error) {
      return res.redirect(`http://localhost:5173/payment-failed?status=failed`);
      next(error);
    }
  };

  // Cancel an order
  cancelOrder = async (req, res, next) => {
    res.redirect(`${process.env.FRONT_URL}/failure.html`);
  };
}

module.exports = EnrollmentController;
