const jwt = require('jsonwebtoken');
// require('dotenv').config();
// JWT_SECRET=mynameissomethinglikestartwithathatsit
// const cookies = require('cookies');
const secretKey = 'mynameissomethinglikestartwithathatsit';


function preventAccessToLoginSignup(req, res, next) {
    const token = req.cookies.token;

    if (token) {
        jwt.verify(token, secretKey, (err, user) => {
            if (!err && user) {
                // User is already logged in, redirect to dashboard or homepage
                let redirectUrl = '/';
                if (user.role === 'vendor') {
                    redirectUrl = '/vender/dashboard';
                } else if (user.role === 'user') {
                    redirectUrl = '/';
                } else if (user.role === 'admin') {
                    redirectUrl = '/admin/dashboard';
                }
                return res.redirect(redirectUrl);
            }
            // If there's an error or no user, proceed to next middleware
            next();
        });
    } else {
        // If no token exists, proceed to next middleware
        next();
    }
}

module.exports = {
    preventAccessToLoginSignup,
};
