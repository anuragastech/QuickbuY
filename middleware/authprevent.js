
// --------------------------   
const jwt = require('jsonwebtoken');
const secretKey = 'mynameissomethinglikestartwithathatsit';

function authenticateJWT(req, res, next) {
    const token = req.cookies.token;

    if (token) {
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                console.error(err);
                return res.status(403).json({ message: 'Forbidden' });
            }

            if (!user.role) {
                console.error('Role not found in token payload');
                return res.status(403).json({ message: 'Forbidden - Role not found' });
            }

            if (user.role === 'vender') {
                req.vender = user;
            }
            else if (user.role === 'admin') {
                req.admin = user;
            }

            req.userId = user.id;

            res.locals.userSignedIn = true; // Set sign-in status in response locals
            next();
        });
    } else {
    
        res.locals.userSignedIn = false; // Set sign-in status in response locals to false for consistency
        next();
    }
}

module.exports = {
    authenticateJWT,
};
