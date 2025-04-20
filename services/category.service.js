class CategoryService {
  constructor(CategoryModel, AppErrors) {
    this.CategoryModel = CategoryModel;
    this.AppErrors = AppErrors;
  }

  // Create a new category
  async createCategory(data) {
        // Check if the category already exists
        const existingCategory = await this.CategoryModel.findOne({
          where: { name: data.name },
        });
    
        if (existingCategory) {
          throw new this.AppErrors("Category with this name already exists", 400);
        }
    const category = await this.CategoryModel.create(data);
    return category;
  }

  // Get all categories
  async getAllCategories() {
    const categories = await this.CategoryModel.findAll();
    return categories;
  }

  // Get a category by name
  async getCategoryByName(name) {
    const category = await this.CategoryModel.findOne({ where: { name } });
    if (!category) {
      throw new this.AppErrors("Category not found", 404);
    }
    return category;
  }


  // Update a category
  async updateCategory(id, data) {
    const category = await this.CategoryModel.findByPk(id);
    if (!category) {
      throw new this.AppErrors("Category not found", 404);
    }
    await category.update(data);
    return category;
  }

  // Delete a category
  async deleteCategory(id) {
    const category = await this.CategoryModel.findByPk(id);
    if (!category) {
      throw new this.AppErrors("Category not found", 404);
    }
    await category.destroy();
    return { message: "Category deleted successfully" };
  }
}

module.exports = CategoryService;
