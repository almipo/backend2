const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../model/User.js'); 


const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
       token = req.cookies['token']; 
    }
    return token;
 };

// Configuración de opciones de JWT
const options = {
   jwtFromRequest: cookieExtractor, 
   secretOrKey: '1234', 
};

//  obtener al usuario desde el token
passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
       try {
          const user = await User.findById(jwt_payload.id);
          if (user) {
             return done(null, user);
          }
          return done(null, false);
       } catch (error) {
          return done(error, false);
       }
    })
 );

module.exports = passport;
