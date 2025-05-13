class ProfileController {
  constructor(profileService) {
    this.profileService = profileService;
  }

  getProfile = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const profile = await this.profileService.getProfile(userId);
      res.json(profile);
    } catch (err) {
      next(err);
    }
  };

  updateProfile = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const updated = await this.profileService.updateProfile(userId, req.body);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  };

  updatePassword = async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      const result = await this.profileService.updatePassword(
        userId,
        currentPassword,
        newPassword
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  updateProfilePicture = async (req, res, next) => {
    try {
      const userId = req.user.id;
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Profile picture is required." });
      }
      const profilePicture = `/uploads/profilePictures/${req.file.filename}`;
      const result = await this.profileService.updateProfilePicture(
        userId,
        profilePicture
      );
      res.json({ message: "Profile picture updated", profilePicture });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = ProfileController;
