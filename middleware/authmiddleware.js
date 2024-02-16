const jwt = require('jsonwebtoken');
// require('dotenv').config();
// JWT_SECRET=mynameissomethinglikestartwithathatsit
// const cookies = require('cookies');
const secretKey = 'mynameissomethinglikestartwithathatsit';
function authenticateJWT(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        let redirectUrl = '/login'; // Default redirection URL
        if (req.originalUrl.includes('/vender')) {
            redirectUrl = '/vender/login'; // Redirect to vender login page
        } else if (req.originalUrl.includes('/user')) {
            redirectUrl = '/user/login'; // Redirect to user login page
        }
        return res.redirect(redirectUrl);
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            console.error(err);
            return res.status(403).json({ message: 'Forbidden' });
        }

        if (!user.role) {
            console.error('Role not found in token payload');
            return res.status(403).json({ message: 'Forbidden - Role not found' });
        }

        // Example: Store user details in req.vender for vender routes
        if (user.role === 'vender') {
            req.vender = user;
        }
        // Example: Store user details in req.user for user routes
        else if (user.role === 'user') {
            req.user = user;
        }
        // Example: Store user details in req.admin for admin routes
        else if (user.role === 'admin') {
            req.admin = user;
        }

        next();
    });
}


module.exports = {
    authenticateJWT,
};
