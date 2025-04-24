const getTokenFromHeader = require("../Auth/getToken");
const { jsonResponse } = require("../lib/jsonResponse");


//definir ruta obtiene el token que se envio en el header y valida que exista para que pueda crear uno nuevo
const router = require("express").Router();
router.delete("/", async (req, res) => {
    try {
        const refreshToken = getTokenFromHeader(req.headers);
        if (refreshToken) {
            await tokens.findOneAndRemove ({ token: refreshToken });
            res.status(200).json(jsonResponse(200, { message: "Token deleted" }));
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(jsonResponse(500, {error: "Error servidor"}));
    }
});

module.exports = router;