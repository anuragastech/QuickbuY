const jwt = require('jsonwebtoken');
// require('dotenv').config();
// JWT_SECRET=mynameissomethinglikestartwithathatsit
// const cookies = require('cookies');


const secretKey =  'mynameissomethinglikestartwithathatsit';
function authenticateJWT(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        if (req.originalUrl.includes('/vender')) {
            return res.redirect('/vender/login');
        } else if (req.originalUrl.includes('/user')) {
            return res.redirect('/user/login');
        } else {
            return res.redirect('/login'); // Default login page
        }

        
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            console.error(err);
            return res.status(403).json({ message: 'Forbidden' });
        }

        console.log('Decoded Token Payload:', user);

        if (!user.role) {
            console.error('Role not found in token payload');
            return res.status(403).json({ message: 'Forbidden - Role not found' });
        }
        if (user.role === 'vender') {
        } else if (user.role === 'user') {
        } else if (user.role === 'admin') {
        } else {
        }
        req.user = user;
        next();
    });
}

module.exports = {
    authenticateJWT,
};
