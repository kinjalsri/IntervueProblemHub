const ensureAdmin = (req, res, next) => {

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            message: 'Access denied. Company Admins only.'
        });
    }

    next();
};

module.exports = ensureAdmin;