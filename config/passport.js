// config/passport.js

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user.model');

// Configuración de la estrategia Local (para login)
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }

        if (!user.comparePassword(password)) {
            return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Configuración de la estrategia JWT (para obtener el usuario logueado)
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secretkey', // La misma clave utilizada en la generación de JWT
}, async (jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.id);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));
