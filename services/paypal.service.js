const axios = require("axios");
const PaymentService = require("./payment.service");

class PaypalService extends PaymentService {
  constructor() {
    super();
    this.baseUrl = process.env.PAYPAL_BASE_URL;
  }
  async generateAccessToken() {
    const response = await axios({
      url:  this.baseUrl + "/v1/oauth2/token",
      method: "post",
      data: "grant_type=client_credentials",
      auth: {
        username: process.env.PAYPAL_CLIENT_ID,
        password: process.env.PAYPAL_SECRET,
      },
    });

    return response.data.access_token;
  }

  async createOrder(finalPrice, orderId) {
    try {
      const accessToken = await this.generateAccessToken();

      const requestData = {
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: orderId.toString(),
            amount: {
              currency_code: "USD",
              value: finalPrice.toFixed(2), // Ensure the price is a string with 2 decimal places
            },
          },
        ],
        application_context: {
          return_url: `${process.env.BASE_URL}/api/orders/complete-order`,
          cancel_url: `${process.env.BASE_URL}/api/orders/cancel-order`,
        },
      };

      console.log("PayPal Request Data:", JSON.stringify(requestData, null, 2));

      const response = await axios({
        url: `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        data: requestData,
      });

      const approvalUrl = response.data.links.find((link) => link.rel === "approve").href;
      const Token = response.data.id;
  
     
      return {
        approvalUrl,
        Token,
      };
    } catch (error) {
      console.error("Error creating PayPal order:", error.response?.data || error.message);
      throw new Error("Failed to create PayPal order.");
    }
  }

  async capturePayment(orderId) {
    const accessToken = await this.generateAccessToken();

    const response = await axios({
      url: process.env.PAYPAL_BASE_URL + `/v2/checkout/orders/${orderId}/capture`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    });

    return response.data;
  }
}

module.exports = PaypalService;
