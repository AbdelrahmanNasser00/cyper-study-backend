const { v4: uuidv4 } = require("uuid");

/**
 * Service class for managing certificates
 */
class certificateService {
  /**
   * Initializes the CertificateService with required models and error handler
   * @param {Object} CertificateModel - The Certificate Sequelize model
   * @param {Object} EnrollmentModel - The Enrollment Sequelize model
   * @param {Object} CourseModel - The Course Sequelize model
   * @param {Object} UserModel - The User Sequelize model
   * @param {Function} AppErrors - Custom error handler class
   */
  constructor(
    CertificateModel,
    EnrollmentModel,
    CourseModel,
    UserModel,
    AppErrors
  ) {
    this.CertificateModel = CertificateModel;
    this.EnrollmentModel = EnrollmentModel;
    this.CourseModel = CourseModel;
    this.UserModel = UserModel;
    this.AppErrors = AppErrors;
  }

  /**
   * Generates a new certificate for a user if they completed a course
   * @param {number} userId - The ID of the user
   * @param {number} courseId - The ID of the course
   * @returns {Promise<Object>} The created certificate
   * @throws {AppErrors} If the enrollment is not found or progress < 100
   */
  async generateCertificate(userId, courseId) {
    // Check if the user is enrolled in the course
    const enrollment = await this.EnrollmentModel.findOne({
      where: { userId, courseId },
    });
    if (!enrollment) {
      throw new this.AppErrors("Enrollment not found", 404);
    }

    // Ensure the course is fully completed
    if (enrollment.progress < 100) {
      throw new this.AppErrors(
        "You must complete the course to generate a certificate",
        403
      );
    }

    // Check if certificate already exists
    let certificate = await this.CertificateModel.findOne({
      where: { userId, courseId },
    });

    if (!certificate) {
      // Generate a unique certificate code
      const certificateCode = `${uuidv4().slice(0, 8).toUpperCase()}-${uuidv4().slice(0, 4).toUpperCase()}-${uuidv4().slice(0, 4).toUpperCase()}`;
      // Create the certificate
      certificate = await this.CertificateModel.create({
        userId,
        courseId,
        certificateCode: certificateCode,
      });
    }

    // Fetch the full certificate details including associations
    const fullCertificateDetails = await this.getCertificateById(
      certificate.id
    );

    return fullCertificateDetails; // Return the detailed object
  }

  /**
   * Retrieves all certificates with their associated user and course information
   * @returns {Promise<Array>} List of certificates
   */
  async getAllCertificates() {
    const certificates = await this.CertificateModel.findAll({
      include: [
        {
          model: this.UserModel,
          attributes: ["id", "firstname", "lastname", "email"],
        },
        {
          model: this.CourseModel,
          attributes: ["id", "title", "thumbnail"],
          include: [
            {
              model: this.UserModel,
              as: "instructor",
              attributes: ["id", "firstname", "lastname"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return certificates;
  }

  /**
   * Retrieves all certificates for a specific user
   * @param {number} userId - The ID of the user
   * @returns {Promise<Array>} List of the user's certificates
   */
  async getMyCertificates(userId) {
    const certificates = await this.CertificateModel.findAll({
      where: { userId },
      include: [
        {
          model: this.UserModel,
          attributes: ["id", "firstname", "lastname"],
        },
        {
          model: this.CourseModel,
          attributes: ["id", "title", "thumbnail"],
          include: [
            {
              model: this.UserModel,
              as: "instructor",
              attributes: ["id", "firstname", "lastname"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return certificates;
  }

  /**
   * Retrieves a certificate by its ID including detailed information
   * @param {number} certificateId - The ID of the certificate
   * @returns {Promise<Object>} The certificate data
   * @throws {AppErrors} If the certificate is not found
   */
  async getCertificateById(certificateId) {
    const certificate = await this.CertificateModel.findByPk(certificateId, {
      include: [
        {
          model: this.UserModel,
          attributes: ["id", "firstname", "lastname", "email"],
        },
        {
          model: this.CourseModel,
          attributes: ["id", "title", "description"],
          include: [
            {
              model: this.UserModel,
              as: "instructor",
              attributes: ["id", "firstname", "lastname"],
            },
          ],
        },
      ],
    });

    if (!certificate) {
      throw new this.AppErrors("Certificate not found", 404);
    }

    return certificate;
  }

  /**
   * Deletes a certificate by its ID
   * @param {number} certificateId - The ID of the certificate
   * @returns {Promise<Object>} Success message
   * @throws {AppErrors} If the certificate is not found
   */
  async deleteCertificate(certificateId) {
    const certificate = await this.CertificateModel.findByPk(certificateId);

    if (!certificate) {
      throw new this.AppErrors("Certificate not found", 404);
    }

    await certificate.destroy();
    return { message: "Certificate deleted successfully" };
  }
}

module.exports = certificateService;
