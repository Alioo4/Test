const {Router} = require("express");

const {registerAdmin, loginAdmin, getAdmin, getAllUsers} = require("../controllers/admin.controller");

const isAdmin = require("../middleware/is-admin-middleware");

const route = Router();

route.post("/register", registerAdmin); //isAdmin
route.post("/login", loginAdmin);
route.get("/users", isAdmin, getAllUsers);
route.get("/", isAdmin, getAdmin);

module.exports = route;