//definir ruta
const router = require("express").Router();
//const { Await } = require("react-router-dom");
const { jsonResponse } = require("../lib/jsonResponse");
const User = require("../schema/userSchema")

router.post("/", async(req, res) => {
    const { username, name, password } = req.body;
    if (!!!username || !!!name || !!!password ) {
    return res.status(400).json(
        jsonResponse(400, {
            error: "Campos son requeridos"
        })
    );
}

// crear usuario en BD lo instancia
//const user = new User({username,name,password});
try {
    const user = new User({username,name,password});
    const exists = await user.usernameExist(username);
    if (exists) {
        return res.status(400).json(
            jsonResponse(400, {
                error: "Usuario ya existe",
            })
        );
    }
    const newUser = new User({username,name,password});
    await newUser.save();
    console.log("salvo", newUser);

    res
    .status(200)
    .json(jsonResponse(200, { message: "Usuario creado satisfactoriamente"}));

    console.log("fin")    
    } catch (error) {
        console.error("<><><>", error);
    res.status(500).json(
        jsonResponse(500, {
            error: "Error creando usuario",
        })
    );  
    }
});

    
    

module.exports = router;