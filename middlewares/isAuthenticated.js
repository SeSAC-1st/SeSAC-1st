const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.status(401).send('You need to log in.');
};

module.exports = isAuthenticated;