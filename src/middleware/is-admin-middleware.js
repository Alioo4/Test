const { checkTokenAdmin } = require("../helpers/jwt")

const isAdmin = (req, res, next) => {
    if(!req.headers.token)
        return res.status(401).json({message: "Permission denied"})

    checkTokenAdmin(req.headers.token, (err, data) => {
        if(err) 
            return res.status(401).json({message: "Permission denied"})
        req.user = data

        next();
    });
};

module.exports = isAdmin;