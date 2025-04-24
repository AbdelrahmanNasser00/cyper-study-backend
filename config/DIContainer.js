const db = require("../models");
const {
  User,
  Course,
  Lesson,
  Enrollment,
  Category,
  Wishlist,
  Cart,
  CartItems,
  Coupon,
  Review,
} = db;
// const Category = require("../models/category");
// const Order = require("../models/order");
// const OrderItem = require("../models/orderItem");
// const Enrollment = require("../models/enrollment");
// const Wishlist = require("../models/wishlist");
// const Review = require("../models/review");
// const Cart = require("../models/cart");
// const Certificate = require("../models/certificate");
// const Notification = require("../models/notification");
// const Payment = require("../models/payment");
// const Coupon = require("../models/coupon");

// Utils
const AppErrors = require("../utils/AppErrors");
const passwordUtils = require("../utils/passwordUtils");
const tokenUtils = require("../utils/tokenUtils");

// Controllers
const AuthController = require("../controllers/auth.controller");
const CourseController = require("../controllers/course.controller");
const LessonController = require("../controllers/lesson.controller");
const CategoryController = require("../controllers/category.controller");
const CartController = require("../controllers/cart.controller");
const WishlistController = require("../controllers/wishlist.controller");
const CouponController = require("../controllers/coupon.controller");
const ReviewController = require("../controllers/review.controller");

// const OrderController = require("../controllers/order.controller");
// const EnrollmentController = require("../controllers/enrollment.controller");
// const CertificateController = require("../controllers/certificate.controller");
// const NotificationController = require("../controllers/notification.controller");
// const PaymentController = require("../controllers/payment.controller");

// Services
const AuthService = require("../services/auth.service");
const CategoryService = require("../services/category.service");
const CourseService = require("../services/course.service");
const LessonService = require("../services/lesson.service");
const WishlistService = require("../services/wishlist.service");
const CartService = require("../services/cart.service");
const couponService = require("../services/coupon.service");
const ReviewService = require("../services/review.service");

// const OrderService = require("../services/order.service");
// const EnrollmentService = require("../services/enrollment.service");
// const CertificateService = require("../services/certificate.service");
// const NotificationService = require("../services/notification.service");
// const PaymentService = require("../services/payment.service");

class DIContainer {
  constructor() {
    if (!DIContainer.instance) {
      // Services
      this.authService = new AuthService(
        User,
        passwordUtils,
        tokenUtils,
        AppErrors
      );
      this.courseService = new CourseService(
        Course,
        User,
        Enrollment,
        Lesson,
        Category,
        AppErrors
      );
      this.lessonService = new LessonService(Lesson, AppErrors);
      this.categoryService = new CategoryService(Category, AppErrors);
      this.wishlistService = new WishlistService(Wishlist, Course, AppErrors);
      this.cartService = new CartService(
        Cart,
        CartItems,
        Course,
        Category,
        User,
        AppErrors
      );
      this.couponService = new couponService(Coupon, AppErrors);
      this.reviewService = new ReviewService(Review, User, AppErrors);

      // Controllers
      this.authController = new AuthController(this.authService);
      this.courseController = new CourseController(this.courseService);
      this.lessonController = new LessonController(this.lessonService);
      this.categoryController = new CategoryController(this.categoryService);
      this.wishlistController = new WishlistController(this.wishlistService);
      this.cartController = new CartController(this.cartService);
      this.couponController = new CouponController(this.couponService);
      this.reviewController = new ReviewController(this.reviewService);

      DIContainer.instance = this;
    }
    return DIContainer.instance;
  }
}

const instance = new DIContainer();
Object.freeze(instance);

module.exports = instance;
