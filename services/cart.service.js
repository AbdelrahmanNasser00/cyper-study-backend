const { sequelize } = require("../models");

class CartService {
  constructor(
    CartModel,
    CartItemsModel,
    CourseModel,
    CategoryModel,
    UserModel,
    AppErrors
  ) {
    this.CartModel = CartModel;
    this.AppErrors = AppErrors;
    this.CartItemsModel = CartItemsModel;
    this.CourseModel = CourseModel;
    this.CategoryModel = CategoryModel;
    this.UserModel = UserModel;
  }

  async getCart(userId) {
    const cart = await this.CartModel.findOne({ where: { userId } });
    if (!cart) return { totalPrice: 0.0, items: [] };

    const courses = await this.CourseModel.findAll({
      include: [
        {
          model: this.CartItemsModel,
          where: { cartId: cart.id },
          attributes: ["id", "coursePrice", "createdAt"],
        },
        {
          model: this.UserModel,
          as: "instructor",
          attributes: ["firstname", "lastname"],
        },
        {
          model: this.CategoryModel,
          attributes: ["name"],
        },
      ],
      where: { isPublished: true },
    });

    const items = courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      price: course.price,
      thumbnail: course.thumbnail,
      level: course.level,
      duration: course.duration,
      instructor: `${course.instructor.firstname} ${course.instructor.lastname}`,
      category: course.Category.name,
      cartItem: {
        id: course.CartItems[0].id,
        coursePrice: course.CartItems[0].coursePrice,
        createdAt: course.CartItems[0].createdAt,
      },
    }));

    return { totalPrice: cart.totalPrice, items };
  }
  async addToCart(userId, courseId) {
    const course = await this.CourseModel.findByPk(courseId);
    let cart = await this.CartModel.findOne({ where: { userId } });
    if (!cart) {
      cart = await this.CartModel.create({ userId, totalPrice: 0.0 });
    }
    const existing = await this.CartItemsModel.findOne({
      where: { cartId: cart.id, courseId },
    });
    if (existing) throw new this.AppErrors("Course already in cart", 400);

    const cartItem = await this.CartItemsModel.create({
      cartId: cart.id,
      courseId,
      coursePrice: course.price,
    });

    await this.CartModel.update(
      { totalPrice: Number(cart.totalPrice) + Number(cartItem.coursePrice) },
      { where: { id: cart.id } }
    );

    return cartItem;
  }

  async removeFromCart(userId, courseId) {
    let cart = await this.CartModel.findOne({ where: { userId } });
    if (!cart) throw new this.AppErrors("Cart not found", 404);

    const cartItem = await this.CartItemsModel.findOne({
      where: { cartId: cart.id, courseId },
    });
    if (!cartItem) throw new this.AppErrors("Course not in cart", 404);

    await this.CartModel.update(
      {
        totalPrice: cart.totalPrice - cartItem.coursePrice,
      },
      { where: { id: cart.id } }
    );

    await cartItem.destroy();

    return cartItem;
  }
}

module.exports = CartService;
