const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');

const isAuth = async (req, res, next) => {
    try {

        const token = req.headers.authorization;
        if (!token) {
            const error = new Error();
            error.status = 401;
            error.message = "Unauthorized";
            return next(error);
        }

        const parsedToken = token.replace('Bearer ', '');
        const validToken = jwt.verify(parsedToken, process.env.JWT_SECRET);

        const userLoggedIn = await User.findById(validToken.id);
        userLoggedIn.password = null;
        req.user = userLoggedIn;
        next();
        
    } catch (error) {
        next(error);
    }
}

module.exports = {
    isAuth
}