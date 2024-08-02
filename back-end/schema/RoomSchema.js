const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  users: [
    {
      id: { type: String },
      username: { type: String, unique: true, required: false },
    },
  ],
  messages: [
    {
      sender: { type: String, required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

RoomSchema.statics.findOrCreateRoom = async function (userIds) {
  console.log("HERE and ->", userIds);
  const room = await this.findOne({
    "users.id": { $all: userIds },
  });

  if (room) {
    console.log("Room encontrado, retornando room: ", room);
    return room;
  } else {
    console.log("Room no encontrado, creando nuevo room...");
    const newRoom = new this({
      users: userIds.map((id) => ({ id })),
      messages: [],
    });

    newRoom.save();
    console.log(newRoom);
    return newRoom;
  }
};

module.exports = mongoose.model("Room", RoomSchema);
