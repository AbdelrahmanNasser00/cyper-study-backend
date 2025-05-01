class DashboardController {
  constructor(dashboardService) {
    this.dashboardService = dashboardService;
  }

  summary = async (req, res, next) => {
    try {
      const instructorId = req.user.id;
      const result = await this.dashboardService.summary(instructorId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getRatingsSummary = async (req, res, next) => {
    try {
      const instructorId = req.user.id;
      const result =
        await this.dashboardService.getRatingsSummary(instructorId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getCoursePerformance = async (req, res, next) => {
    try {
      const { courseId } = req.params;
      const result = await this.dashboardService.getCoursePerformance(courseId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getMonthlyEarningsBreakdown = async (req, res, next) => {
    try {
      const instructorId = req.user.id;
      const result =
        await this.dashboardService.getMonthlyEarningsBreakdown(instructorId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = DashboardController;
