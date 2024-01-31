const superAdminMiddleware = (req, res, next) => {
    // Check if the user is authenticated and is a super admin
    if (req.user && req.user.role === 'admin') {
        next(); // Allow access to the route
    } else {
        res.status(403).json({ error: 'Access forbidden' });
    }
};
