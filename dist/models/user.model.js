"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcryptjs = require("bcryptjs");

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _mongooseAutoIncrement = require("mongoose-auto-increment");

var _mongooseAutoIncrement2 = _interopRequireDefault(_mongooseAutoIncrement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserSchema = new _mongoose.Schema({
    userName: {
        type: String,
        trim: true,
        required: true
    },
    type: {
        type: String,
        enum: ["ADMIN", "NORMAL"],
        default: "NORMAL"
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: [true, "Duplicated Phone"]
    },
    jobs: [{
        type: Number,
        ref: "job",
        required: true
    }],
    vehicleToWork: [{
        type: String,
        required: true
    }],
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    city: {
        type: Number,
        ref: 'city',
        required: true
    },
    location: {
        type: [Number], // Don't forget [0=>longitude,1=>latitude]
        required: true,
        index: '2d'
    },
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    img: { // url 
        type: String,
        default: "https://icon-icons.com/icons2/582/PNG/512/worker_icon-icons.com_55029.png"
    },
    birthDate: {
        type: Date,
        required: true
    },
    creationDate: {
        type: Date,
        default: new Date()
    },
    trusted: {
        type: Boolean,
        default: false
    },
    nationalIdImgs: [{
        type: String
    }],
    policyIdentityImage: {
        type: String
    },
    about: {
        type: String
    },
    portofolio: [{
        type: String //array of urls
    }],
    status: {
        type: String,
        enum: ['online', 'offline', 'on Vacation'],
        default: 'online'
    },
    completed: {
        type: Boolean,
        default: false
    },
    pushTokens: [{
        type: String
    }],
    rating: {
        type: Number,
        default: 0
    }

});

UserSchema.pre("save", function (next) {
    var account = this;
    if (!account.isModified('password')) return next();

    var salt = _bcryptjs2.default.genSaltSync();
    _bcryptjs2.default.hash(account.password, salt).then(function (hash) {
        account.password = hash;
        next();
    }).catch(function (err) {
        return console.log(err);
    });
});

UserSchema.methods.isValidPassword = function (newPassword, callback) {
    var user = this;
    _bcryptjs2.default.compare(newPassword, user.password, function (err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

UserSchema.set('toJSON', {
    transform: function transform(doc, ret, options) {
        ret.id = ret._id;

        delete ret.password;
        delete ret.pushTokens;
        delete ret._id;
        delete ret.__v;
    }
});

_mongooseAutoIncrement2.default.initialize(_mongoose2.default.connection);
UserSchema.plugin(_mongooseAutoIncrement2.default.plugin, {
    model: 'user',
    startAt: 1
});

exports.default = _mongoose2.default.model("user", UserSchema);
//# sourceMappingURL=user.model.js.map