const { jsonResponse } = require("../lib/jsonResponse");
const User = require("../schema/userSchema");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.status(200).json(jsonResponse(200, req.user));
});

router.put("/", async (req, res) => {
  try {
    console.log(`El usuario id ${req.user.id}, esta cambiando sus datos de ${JSON.stringify(req.user)} a ${JSON.stringify(req.body)}`);
    await User.findByIdAndUpdate(req.user.id, {
      username: req.body.username,
      name: req.body.name,
      password: req.body.passeword,
    });
  } catch (err) {
    console.error("Something went wrong updating an user. see:", err);
  }

  res.status(200).json(jsonResponse(200, req.user));
});

module.exports = router;
