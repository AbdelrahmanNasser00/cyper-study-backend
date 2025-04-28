class CertificateController {
  constructor(certificateService) {
    this.certificateService = certificateService;
  }

  generateCertificate = async (req, res, next) => {
    try {
      const certificate = await this.certificateService.generateCertificate(
        req.user.id,
        req.body.courseId
      );
      res.status(200).json(certificate);
    } catch (err) {
      next(err);
    }
  };

  getAllCertificates = async (req, res, next) => {
    try {
      const certificates = await this.certificateService.getAllCertificates();
      res.status(200).json(certificates);
    } catch (err) {
      next(err);
    }
  };

  getMyCertificates = async (req, res, next) => {
    try {
      const certificates = await this.certificateService.getMyCertificates(
        req.user.id
      );
      res.status(200).json(certificates);
    } catch (err) {
      next(err);
    }
  };

  getCertificateById = async (req, res, next) => {
    try {
      const certificate = await this.certificateService.getCertificateById(
        req.params.id
      );
      res.status(200).json(certificate);
    } catch (err) {
      next(err);
    }
  };

  deleteCertificate = async (req, res, next) => {
    try {
      const certificate = await this.certificateService.deleteCertificate(
        req.params.id
      );
      res.status(200).json(certificate);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = CertificateController;
