class EnrollmentController {
  constructor(enrollmentService) {
    if (!enrollmentService) {
      console.error("EnrollmentService is undefined!");
    }
    this.enrollmentService = enrollmentService;
  }

  // Create an order
 createOrder =async (req, res, next) => {
    try {
      const { courseId, couponCode ,provider} = req.body; // provider: "paypal", "stripe", "fawry"
      const userId=req.user.id;
  
      const {approvalUrl, orderId} = await this.enrollmentService.enroll(userId, courseId, couponCode ,provider)
      res.status(201).json({ message: "Order created", approvalUrl, orderId});
    } catch (error) {
      console.error("Error creating order:", error.message);
      next(error);
    }
  }

  // Complete an order
  completeOrder =async (req, res, next) => {
    try {
     
      
      const orderDetails= await  this.enrollmentService.completeOrder(req.query.token )
     console.log(orderDetails)
      res.status(200).json({ message: "Payment captured", orderDetails });
    } catch (error) {
     
      next(error);
    }
  }

  // Cancel an order
   cancelOrder =async (req, res, next) => {
    res.redirect(`${process.env.FRONT_URL}/failure.html`);
  }
}

module.exports = EnrollmentController;