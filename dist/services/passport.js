"use strict";

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

var _passportJwt = require("passport-jwt");

var _passportJwt2 = _interopRequireDefault(_passportJwt);

var _passportLocal = require("passport-local");

var _passportLocal2 = _interopRequireDefault(_passportLocal);

var _config = require("../config");

var _config2 = _interopRequireDefault(_config);

var _user = require("../models/user.model");

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var JwtStrategy = _passportJwt2.default.Strategy;
var LocalStrategy = _passportLocal2.default.Strategy;
var ExtractJwt = _passportJwt2.default.ExtractJwt;
var jwtSecret = _config2.default.jwtSecret;


_passport2.default.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret
}, function (payload, done) {
    // find user in token
    _user2.default.findById(payload.sub).then(function (user) {
        if (!user) return done(null, false);

        return done(null, user);
    }).catch(function (err) {
        console.log('Passport Error: ', err);
        done(null, false);
    });
}));

_passport2.default.use(new LocalStrategy({
    usernameField: 'phone'
}, function (phone, password, done) {
    _user2.default.findOne({ phone: phone }).then(function (user) {
        if (!user) return done(null, false);

        // Compare Passwords 
        user.isValidPassword(password, function (err, isMatch) {
            if (err) return done(err);
            if (!isMatch) return done(null, false, { error: 'Invalid Credentials' });

            return done(null, user);
        });
    });
}));
//# sourceMappingURL=passport.js.map