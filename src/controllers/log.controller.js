const logService = require("../services/log.service");
const catchAsync = require("../utils/catchAsync");

const getAllLogs = catchAsync(async (req, res, next) => {
    const { page, limit, sortBy, order } = req.query;
    const queryOptions = { page, limit, sortBy, order };

    const result = await logService.getAllLogs(req.user, queryOptions);

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
