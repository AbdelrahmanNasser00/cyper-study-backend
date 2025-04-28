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
  Order,
  OrderItem,
  Certificate,
} = db;

//Factories
const PaymentFactory = require("../factories/Payment.factory");

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
const CertificateController = require("../controllers/certificate.controller");
const EnrollmentController = require("../controllers/enrollment.controller");

// const OrderController = require("../controllers/order.controller");
// const NotificationController = require("../controllers/notification.controller");

// Services
const AuthService = require("../services/auth.service");
const CategoryService = require("../services/category.service");
const CourseService = require("../services/course.service");
const LessonService = require("../services/lesson.service");
const WishlistService = require("../services/wishlist.service");
const CartService = require("../services/cart.service");
const couponService = require("../services/coupon.service");
const EnrollmentService = require("../services/enrollment.service");
const ReviewService = require("../services/review.service");
const PaypalService = require("../services/paypal.service");
const StripeService = require("../services/stripe.service");
const FawryService = require("../services/fawry.service");
const CertificateService = require("../services/certificate.service");

// const OrderService = require("../services/order.service");
// const NotificationService = require("../services/notification.service");

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

      this.paypalService = new PaypalService();
      this.StripeService = new StripeService();
      // this.FawryService=new FawryService(

      //     Course,
      //     Enrollment,
      //     AppErrors
      //   );

      this.couponService = new couponService(Coupon, AppErrors);
      this.reviewService = new ReviewService(Review, User, AppErrors);
      this.certificateService = new CertificateService(
        Certificate,
        Enrollment,
        Course,
        User,
        AppErrors
      );

      //factories
      this.PaymentFactory = new PaymentFactory({
        paypalService: this.paypalService,
        stripeService: this.StripeService,
        fawryService: this.FawryService,
      });

      this.enrollmentService = new EnrollmentService(
        Enrollment,
        Course,
        this.couponService,
        AppErrors,
        this.PaymentFactory,
        Order,
        OrderItem
      );

      // Controllers
      this.authController = new AuthController(this.authService);
      this.courseController = new CourseController(this.courseService);
      this.lessonController = new LessonController(this.lessonService);
      this.categoryController = new CategoryController(this.categoryService);
      this.wishlistController = new WishlistController(this.wishlistService);
      this.couponController = new CouponController(this.couponService);
      this.enrollmentController = new EnrollmentController(
        this.enrollmentService
      );
      this.cartController = new CartController(this.cartService);
      this.couponController = new CouponController(this.couponService);
      this.reviewController = new ReviewController(this.reviewService);
      this.certificateController = new CertificateController(
        this.certificateService
      );

      DIContainer.instance = this;
    }
    return DIContainer.instance;
  }
}

const instance = new DIContainer();
Object.freeze(instance);

module.exports = instance;
