const {Router} = require("express");

const {registerController, loginController} = require("../controllers/auth.controller");

const route = Router();

route.post("/register", registerController)
route.post("/login", loginController)


module.exports = route;