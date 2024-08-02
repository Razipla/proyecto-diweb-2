const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
    idUser: { type: String, required: true },
    username: { type: String, required: true },
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likedBy: [{ username: String, userId: mongoose.Schema.Types.ObjectId }]
});

module.exports = mongoose.model("Todo", TodoSchema);