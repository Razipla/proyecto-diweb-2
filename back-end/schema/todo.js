const Mongoose = require("mongoose");

const TodoSchema = new Mongoose.Schema({
    id: { type: Object, required: false },
    idUser: { type: String, required: true },
    title: { type: String, required: true },
    completed: { type: Boolean, required: true },
});

module.exports = Mongoose.model("Todo", TodoSchema);