const getTokenFromHeader = require("../Auth/getToken");
const { generateAccessToken } = require("../Auth/tokensGenerator");
const { verifyRefreshToken } = require("../Auth/validateToken");
const { jsonResponse } = require("../lib/jsonResponse");
const Token = require("../schema/tokens");

const router = require("express").Router();

router.post("/", async (req, res) => {
  const refreshToken = getTokenFromHeader(req.headers);

  if (refreshToken) {
    try {
      const found = await Token.findOne({ token: refreshToken });
      if (!found) {
        return res.status(401).send(jsonResponse(401, { error: "Unauthorized" }));
      }

      const payload = verifyRefreshToken(found.token);
      if (payload) {
        const accessToken = generateAccessToken(payload.user);
        return res.status(200).json(jsonResponse(200, { accessToken }));
      } else {
        return res.status(401).send(jsonResponse(401, { error: "Unauthorized" }));
      }

    } catch (error) {
      return res.status(401).send(jsonResponse(401, { error: "Unauthorized" }));
    }
    //Olvidamos los return y enviamos la respuesta multiple veces
  } else {
    return res.status(401).send(jsonResponse(401, { error: "Unauthorized" }));
  }
});

module.exports = router;