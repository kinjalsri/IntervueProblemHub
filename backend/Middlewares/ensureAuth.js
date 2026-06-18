const jwt = require('jsonwebtoken');

const ensureAuth = (req, res, next) => {

    // get token from headers
    const authHeader = req.headers.authorization;

    // check token exists
    if (!authHeader) {
        return res.status(401).json({
            message: 'No token provided'
        });
    }

    try {

        // format: Bearer TOKEN
        const token = authHeader.split(' ')[1];

        // verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // attach user data to request
        req.user = decoded;

        next();

    } catch (err) {

        return res.status(401).json({
            message: 'Invalid token'
        });
    }
};

module.exports = ensureAuth;