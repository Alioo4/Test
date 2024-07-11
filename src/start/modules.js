const cors = require("cors");

const authRoute = require("../routes/auth.route");
const adminRoute = require("../routes/admin.route");
const blogRoute = require("../routes/post.route");

const isAuth = require("../middleware/is-auth-middleware");

const modules = (app, express) => {
    app.use(express.json());
    app.use(cors({
        origin: "*",
    }));
    app.use("/api/auth", authRoute);
    app.use("/api/admin", adminRoute);
    app.use("/api/blog", blogRoute);//isAuth
}

module.exports = modules;