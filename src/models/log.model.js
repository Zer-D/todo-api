const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        action: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        targetModel: {
            type: String,
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        snapshot: {
            type: mongoose.Schema.Types.Mixed,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Log', logSchema);
