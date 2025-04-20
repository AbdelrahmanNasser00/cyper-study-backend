class CategoryController {
  constructor(categoryService) {
    this.categoryService = categoryService;
   
  }

  createCategory = async (req, res, next) => {
    try {
   
      const category = await this.categoryService.createCategory(req.body);
      res.status(201).json({ message: "Category created successfully", category });
    } catch (error) {
      next(error);
    }
  };

  getAllCategories = async (req, res, next) => {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  };

  getCategoryByName = async (req, res, next) => {
    try {
      const category = await this.categoryService.getCategoryByName(req.params.name);
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  };

  updateCategory = async (req, res, next) => {
    try {
      const category = await this.categoryService.updateCategory(req.params.id, req.body);
      res.status(200).json({ message: "Category updated successfully", category });
    } catch (error) {
      next(error);
    }
  };

  deleteCategory = async (req, res, next) => {
    try {
      const result = await this.categoryService.deleteCategory(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = CategoryController;