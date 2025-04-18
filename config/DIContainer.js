const db = require("../models");
const { User, Course } = db;
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
// const CategoryController = require("../controllers/category.controller");
// const OrderController = require("../controllers/order.controller");
// const EnrollmentController = require("../controllers/enrollment.controller");
// const WishlistController = require("../controllers/wishlist.controller");
// const ReviewController = require("../controllers/review.controller");
// const CartController = require("../controllers/cart.controller");
// const CertificateController = require("../controllers/certificate.controller");
// const NotificationController = require("../controllers/notification.controller");
// const PaymentController = require("../controllers/payment.controller");
// const CouponController = require("../controllers/coupon.controller");

// Services
const AuthService = require("../services/auth.service");
const CourseService = require("../services/course.service");
// const UserService = require("../services/user.service");
// const CategoryService = require("../services/category.service");
// const OrderService = require("../services/order.service");
// const EnrollmentService = require("../services/enrollment.service");
// const WishlistService = require("../services/wishlist.service");
// const ReviewService = require("../services/review.service");
// const CartService = require("../services/cart.service");
// const CertificateService = require("../services/certificate.service");
// const NotificationService = require("../services/notification.service");
// const PaymentService = require("../services/payment.service");
// const CouponService = require("../services/coupon.service");

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
      this.courseService = new CourseService(Course, AppErrors);

      // Controllers
      this.authController = new AuthController(this.authService);
      this.courseController = new CourseController(this.courseService);

      DIContainer.instance = this;
    }
    return DIContainer.instance;
  }
}

const instance = new DIContainer();
Object.freeze(instance);

module.exports = instance;
