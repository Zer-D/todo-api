const logService = require("../services/log.service");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const getAllLogs = catchAsync(async (req, res, next) => {
    if (req.user.role !== "admin") {
        return next(new AppError("You do not have permission to view activity logs", 403));
    }

    const { page, limit, sortBy, order } = req.query;
    const result = await logService.getAllLogs({ page, limit, sortBy, order });

    res.status(200).json({
        success: true,
        message: "Activity logs retrieved successfully",
        data: result.logs,
        pagination: result.pagination,
    });
});

module.exports = {
    getAllLogs,
};
