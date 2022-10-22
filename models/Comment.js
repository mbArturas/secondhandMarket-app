const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        required: true,
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
    },
    createdBy: {
        type: String,
        ref: "User"
    },
    createdById: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Comment", CommentSchema);