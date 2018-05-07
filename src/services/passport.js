
import passport from "passport";
import passportJwt from "passport-jwt";
import passportLocal from "passport-local";
import config from "../config";
import User from "../models/user.model";

const JwtStrategy = passportJwt.Strategy;
const LocalStrategy = passportLocal.Strategy;
const { ExtractJwt } = passportJwt;
const { jwtSecret } = config;


passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret
}, (payload, done) => {
    // find user in token
    User.findById(payload.sub).then(user => {
        if (!user)
            return done(null, false);

        return done(null, user)
    }).catch(err => {
        console.log('Passport Error: ', err);
        done(null, false);
    })
}));


passport.use(new LocalStrategy({
    usernameField: 'phone'
}, (phone, password, done) => {
    User.findOne({ phone }).then(user => {
        if (!user)
            return done(null, false);

        // Compare Passwords 
        user.isValidPassword(password, function (err, isMatch) {
            if (err) return done(err);
            if (!isMatch) return done(null, false, { error: 'Invalid Credentials' });

            return done(null, user);
        })

    });
}));