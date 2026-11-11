const categoryService = require("../services/category.service");
const Log = require("../models/log.model");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const createCategory = catchAsync(async (req, res, next) => {
    const { name } = req.body;

    const category = await categoryService.createCategory({
        name,
    });

    await Log.create({
        user: req.user._id,
        action: "CREATE_CATEGORY",
        description: `User membuat kategori baru: "${category.name}"`,
    });

    res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category,
    });
});

const getAllCategories = catchAsync(async (req, res, next) => {
    const { page, limit, search, sortBy, order } = req.query;
    const queryOptions = { page, limit, search, sortBy, order };

    const result = await categoryService.getAllCategories(queryOptions);

    res.status(200).json({
        success: true,
        message: "Categories retrieved successfully",
        data: result.categories,
        pagination: result.pagination,
    });
});

const getCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);

    if (!category) {
        return next(new AppError("Category not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Category retrieved successfully",
        data: category,
    });
});

const updateCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;

    const existingCategory = await categoryService.getCategoryById(id);

    if (!existingCategory) {
        return next(new AppError("Category not found", 404));
    }

    const updatedCategory = await categoryService.updateCategory(id, { name });

    await Log.create({
        user: req.user._id,
        action: "UPDATE_CATEGORY",
        description: `User memperbarui kategori menjadi: "${updatedCategory.name}"`,
    });

    res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: updatedCategory,
    });
});

const deleteCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const existingCategory = await categoryService.getCategoryById(id);

    if (!existingCategory) {
        return next(new AppError("Category not found", 404));
    }

    await categoryService.deleteCategory(id);

    await Log.create({
        user: req.user._id,
        action: "DELETE_CATEGORY",
        description: `User menghapus kategori: "${existingCategory.name}"`,
    });

    res.status(200).json({
        success: true,
        message: "Category deleted successfully",
        data: null,
    });
});

module.exports = {
    createCategory,
    getAllCategories,
    getCategory,
    updateCategory,
    deleteCategory,
};
