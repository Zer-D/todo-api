const { body, param } = require('express-validator');

exports.createCategoryRules = [
    body('name')
    .notEmpty()
    .withMessage('Category name is required!')
    .trim()
];

exports.updateCategoryRules = [
    param('id').isMongoId().withMessage('Invalid Category ID format!'),
    body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category name cannot be empty!')
];

exports.getCategoryByIdRules = [
    param('id').isMongoId().withMessage('Invalid Category ID format!')
];

exports.getAllCategoriesRules = [

];
