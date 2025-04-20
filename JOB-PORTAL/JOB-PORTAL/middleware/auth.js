// Sample authentication middleware (optional)
const authenticate = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    // Add JWT verification logic here if needed
    next();
};

module.exports = authenticate;
