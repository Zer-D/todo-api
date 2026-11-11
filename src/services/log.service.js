const Log = require("../models/log.model");

const getAllLogs = async (queryOptions = {}) => {
    const { page = 1, limit = 20, sortBy = 'createdAt', order = 'desc' } = queryOptions;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: order === 'asc' ? 1 : -1 };

    const logs = await Log.find()
    .populate('user', 'name email role')
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Log.countDocuments();

    return {
        logs,
        pagination: {
            totalDocs: total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            limit: parseInt(limit),
        },
    };
};

const createLog = async (logData) => {
    return await Log.create(logData);
};

module.exports = {
    getAllLogs,
    createLog,
};
