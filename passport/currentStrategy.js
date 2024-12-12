const passport = require('passport');
const { extractCookieToken } = require('../utils/extractor');
const User = require('../models/user.model'); // Importamos el modelo de usuario

passport.use('current', async (req, done) => {
    const token = extractCookieToken(req);
    if (!token) {
        return done(null, false, { message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).lean();
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
});
