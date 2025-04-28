const { v4: uuidv4 } = require("uuid");
class certificateService {
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

  async generateCertificate(userId, courseId) {
    const enrollment = await this.EnrollmentModel.findOne({
      where: { userId, courseId },
    });
    if (!enrollment) {
      throw new this.AppErrors("Enrollment not found", 404);
    }
    if (enrollment.progress < 100)
      throw new this.AppErrors(
        "You must complete the course to generate a certificate",
        403
      );
    const certificateCode = `${uuidv4().slice(0, 8).toUpperCase()}-${uuidv4().slice(0, 4).toUpperCase()}-${uuidv4().slice(0, 4).toUpperCase()}`;
    const certificate = await this.CertificateModel.create({
      userId,
      courseId,
      certificateCode: certificateCode,
    });
    return certificate;
  }

  async getAllCertificates() {
    const certificates = await this.CertificateModel.findAll({
      include: [
        { model: this.UserModel, attributes: ["firstname", "lastname"] },
        { model: this.CourseModel, attributes: ["title"] },
      ],
    });

    return certificates;
  }

  async getMyCertificates(userId) {
    const certificates = await this.CertificateModel.findAll({
      where: { userId },
      include: [
        { model: this.UserModel, attributes: ["firstname", "lastname"] },
        { model: this.CourseModel, attributes: ["title"] },
      ],
    });
    return certificates;
  }

  async getCertificateById(certificateId) {
    const certificate = await this.CertificateModel.findByPk(certificateId, {
      include: [
        { model: this.UserModel, attributes: ["firstname", "lastname"] },
        { model: this.CourseModel, attributes: ["title"] },
      ],
    });
    return certificate;
  }
}

module.exports = certificateService;
