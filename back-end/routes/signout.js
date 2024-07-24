const getTokenFromHeader = require("../Auth/getToken");
const { jsonResponse } = require("../lib/jsonResponse");
const Token = require("../schema/tokens");

const router = require("express").Router();

router.delete("/", async (req, res) => {
  try {
    const refreshToken = getTokenFromHeader(req.headers);
    console.log("Token de actualización recibido para signOut:", refreshToken);
    if (refreshToken) {
      const result = await Token.findOneAndDelete({ token: refreshToken });
      console.log("Resultado de la eliminación del token:", result);
      if (!result) {
        console.log("Token no encontrado");
        return res.status(404).json(jsonResponse(404, { message: "Token not found" }));
      }
      res.status(200).json(jsonResponse(200, { message: "Token deleted" }));
    } else {
      res.status(400).json(jsonResponse(400, { error: "No token provided" }));
    }
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json(jsonResponse(500, { error: "Server error" }));
  }
});

module.exports = router;