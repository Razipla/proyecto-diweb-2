const { jsonResponse } = require("../lib/jsonResponse");
const User = require("../schema/userSchema");

const router = require("express").Router();

router.get("/:searchTerm", async (req, res) => {

  const user = await User.findOne({username: req.params.searchTerm});
  console.log(user);

  // TODO: manejar errores.
  res.status(200).json(jsonResponse(200, [user]));
});

module.exports = router;
