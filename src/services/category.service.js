const Category = require("../models/category.model");

const createCategory = async (categoryData) => {
    return await Category.create(categoryData);
};

const getAllCategories = async (queryOptions = {}) => {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', order = 'desc' } = queryOptions;

    const query = {};
    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: order === 'asc' ? 1 : -1 };

    const categories = await Category.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Category.countDocuments(query);

    return {
        categories,
        pagination: {
            totalDocs: total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            limit: parseInt(limit),
        },
    };
};

const getCategoryById = async (id) => {
    return await Category.findById(id);
};

const updateCategory = async (id, updateData) => {
    return await Category.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });
};

const deleteCategory = async (id) => {
    return await Category.findByIdAndDelete(id);
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
