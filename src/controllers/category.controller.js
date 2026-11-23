const categoryService = require("../services/category.service");
const Log = require("../models/log.model");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const Todo = require("../models/todo.model");

const createCategory = catchAsync(async (req, res, next) => {
    const { name, description } = req.body;

    const category = await categoryService.createCategory({
        name,
        description,
        created_by: req.user._id,
        updated_by: req.user._id,
    });

    await Log.create({
        user: req.user._id,
        action: "CREATE_CATEGORY",
        targetModel: "Category",
        targetId: category._id,
        description: `User created a new category: "${category.name}"`,
        snapshot: {
            name: category.name,
            description: category.description,
        },
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
    const { name, description, archived } = req.body;

    const existingCategory = await categoryService.getCategoryById(id);

    if (!existingCategory) {
        return next(new AppError("Category not found", 404));
    }

    const updatedCategory = await categoryService.updateCategory(id, {
        name,
        description,
        archived,
        updated_by: req.user._id,
    });

    const fieldsToCompare = ["name", "description", "archived"];
    const fieldChanged = [];
    const before = {};
    const after = {};

    fieldsToCompare.forEach((field) => {
        const beforeVal = existingCategory[field];
        const afterVal = updatedCategory[field];
        if (JSON.stringify(beforeVal) !== JSON.stringify(afterVal)) {
            fieldChanged.push(field);
            before[field] = beforeVal;
            after[field] = afterVal;
        }
    });

    await Log.create({
        user: req.user._id,
        action: "UPDATE_CATEGORY",
        targetModel: "Category",
        targetId: updatedCategory._id,
        description: `User updated category to: "${updatedCategory.name}"`,
        snapshot: {
            fieldChanged,
            before,
            after,
        },
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

    const associatedTodos = await Todo.find({ category: existingCategory._id });

    await Log.create({
        user: req.user._id,
        action: "DELETE_CATEGORY",
        targetModel: "Category",
        targetId: existingCategory._id,
        description: `User deleted category: "${existingCategory.name}"`,
        snapshot: {
            _id: existingCategory._id,
            name: existingCategory.name,
            todos: associatedTodos.map((t) => ({ _id: t._id, title: t.title })),
        },
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
