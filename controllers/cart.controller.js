class CartController {
  constructor(cartService) {
    this.cartService = cartService;
  }

  getCart = async (req, res, next) => {
    try {
      const cart = await this.cartService.getCart(req.user.id);
      res.status(200).json(cart);
    } catch (err) {
      next(err);
    }
  };
  addToCart = async (req, res, next) => {
    try {
      const cartItem = await this.cartService.addToCart(
        req.user.id,
        req.params.id
      );
      res
        .status(201)
        .json({ message: "Course added to cart successfully", cartItem });
    } catch (err) {
      console.log(err);
      next(err);
    }
  };
  removeFromCart = async (req, res, next) => {
    try {
      const cartItem = await this.cartService.removeFromCart(
        req.user.id,
        req.params.id
      );
      res
        .status(200)
        .json({ message: "Course removed from cart successfully", cartItem });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = CartController;
