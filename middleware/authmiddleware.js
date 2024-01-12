const jwt = require('jsonwebtoken');
// require('dotenv').config();
// JWT_SECRET=mynameissomethinglikestartwithathatsit
// const cookies = require('cookies');


const secretKey =  'mynameissomethinglikestartwithathatsit';
function authenticateJWT(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
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

        if (user.role === 'admin') {
        } else if (user.role === 'user') {
        }

        req.user = user;
        next();
    });
}

module.exports = {
    authenticateJWT,
};
