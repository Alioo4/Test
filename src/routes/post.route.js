const {Router} = require("express");

const {AddPost, getRandom, getTopViewsBlog, getUserWhithBlog} = require("../controllers/post.controller");

const route = Router();

route.post("/", AddPost);
route.get("/random", getRandom);
route.get("/views", getTopViewsBlog);
route.get("/user/:id", getUserWhithBlog);


module.exports = route;