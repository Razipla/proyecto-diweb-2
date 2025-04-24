const getTokenFromHeader = require("../Auth/getToken");
const { generateAccessToken } = require("../Auth/tokensGenerator");
const { verifyRefreshToken } = require("../Auth/validateToken");
const { jsonResponse } = require("../lib/jsonResponse");
const Token = require("../schema/tokens")
//definir ruta obtiene el token que se envio en el header y valida que exista para que pueda crear uno nuevo
const router = require("express").Router();

router.post("/",async (req, res) => {
    const refreshToken = getTokenFromHeader(req.headers);
    if (refreshToken) {
        try {
            const found = await Token.findOne({ token: refreshToken });
            if (!found) {
                return res.status(401).send(jsonResponse(401, {error: "Unauthorized"}));
            }
            const payload = verifyRefreshToken(found.token);
            if(payload) {
                const accessToken = generateAccessToken(payload.user);
                return res.status(200).json(jsonResponse(200, { accessToken }));
            } else {
                res.status(401).send(jsonResponse(401, { error: "Unauthorized" })) 
            }

        } catch (error) {
            res.status(401).send(jsonResponse(401, { error: "Unauthorized" }))
        }
        } else {
            res.status(401).send(jsonResponse(401, { error: "Unauthorized" }));
        }
        res.send("refresh token");
});

module.exports = router