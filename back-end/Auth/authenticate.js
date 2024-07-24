const { decode } = require("jsonwebtoken");
const getTokenFromHeader = require("./getToken");
const { verifyAccessToken } = require("./validateToken");
const { jsonResponse } = require("../lib/jsonResponse");

function authenticate(req, res, next) {
    const token = getTokenFromHeader(req.headers);
    console.log("Token recibido:", token);
    if (token) {
      try {
        const decoded = verifyAccessToken(token);
        console.log("Token decodificado:", decoded);
        if (decoded && decoded.user && decoded.user.id) {
          req.user = { ...decoded.user };
          next();
        } else {
          res.status(401).json(
            jsonResponse(401, {
              message: "Token inválido o usuario no encontrado",
            })
          );
        }
      } catch (error) {
        console.error("Error al verificar el token:", error);
        res.status(401).json(
          jsonResponse(401, {
            message: "Token inválido",
            error: error.message,
          })
        );
      }
    } else {
      console.log("No se proporcionó token");
      res.status(401).json(
        jsonResponse(401, {
          message: "No se proporcionó token",
        })
      );
    }
  }
module.exports = authenticate;