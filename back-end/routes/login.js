//definir ruta
const router = require("express").Router();
const { jsonResponse } = require("../lib/jsonResponse");
const User = require("../schema/userSchema");
const getUserInfo = require("../lib/getUserInfo");
//Define el esquema de usuario y maneja el hash de contraseñas y la comparación de contraseñas.

router.post("/", async (req, res) => {
    const { username, password,  } = req.body;
    if (!!!username || !!!password ) {
        
   
    return res.status(400).json(
        jsonResponse(400, {
            error: "Campos son requeridos"
        })
    );
}

    const user= await User.findOne({ username });
    if (user) {
        const correctPassword = await user.comparePassword(password, user.password);
            if (correctPassword) {
            // generateAccessToken y generateRefreshToken crean tokens JWT para la autenticación.
            const accessToken = user.createAccessToken();
            const refreshToken = await user.createRefreshToken();
    /*const user = {
    id: "1",
    name: "John Wick",
    username: "world_greatest_assassin"
    };*/
            res
            .status(200)
            .json(jsonResponse(200, { user: getUserInfo(user), accessToken, refreshToken }));
        
            } else {
                res.status(400).json(
                 jsonResponse(400, {
                error: "Usuario o password incorrecto ",
            })
        );
    }
} else {
    res.status(400).json(
        jsonResponse(400, {
            error: "Usuario no encontrado",
        })
    );
}


    //res.send("signout");

});
module.exports = router