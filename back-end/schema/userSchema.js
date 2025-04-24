//Conexión DB
const  Mongoose  = require("mongoose");
//Encriptación de password
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require("../Auth/tokensGenerator");
const getUserInfo = require("../lib/getUserInfo");
const Token = require ("../schema/tokens");

//Propiedad de esquema guardados en mongoDB
//Define el esquema de usuario y maneja el hash de contraseñas y la comparación de contraseñas.
//generateAccessToken y generateRefreshToken crean tokens JWT para la autenticación.
const UserSchema = new Mongoose.Schema({
    id: { type: Object },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    
});
//hashear password
UserSchema.pre('save', function (next){
    if (this.isModified('password') || this.isNew) {
        const document = this;
        bcrypt.hash(document.password,10, (err, hash) => {
            if (err) {
                next(err);
            } else {
                document.password = hash;
                next();
            }
        });
    } else {
        next();
    }
});
//Compara que no haya un username igual en DB
UserSchema.methods.usernameExist = async function (username) {
    const result = await Mongoose.model('User').findOne({ username });
    return !! result;
};
//Compara que no haya un password igual en DB
UserSchema.methods.comparePassword = async function (password, hash) {
    const same = await bcrypt.compare(password, hash);
    return same;
};
UserSchema.methods.createAccessToken =  function () {
    return generateAccessToken(getUserInfo(this));
};
UserSchema.methods.createRefreshToken =  async function (next) {
    //Valida que el usaurio este en sesion cuando pide un refresh token este en sesión o en BD
    const refreshToken = generateRefreshToken(getUserInfo(this));
    try {
        await new Token ({ token: refreshToken }).save();
        return refreshToken;
    } catch (error) {
        console.log(error);
    }
};

module.exports= Mongoose.model("User", UserSchema);