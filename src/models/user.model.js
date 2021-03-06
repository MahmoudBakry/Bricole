import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import autoIncrement from 'mongoose-auto-increment';

const UserSchema = new Schema({
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
        default: Date.now
    },
    trusted: {
        type: Boolean,
        default: false
    },
    nationalIdImgs: [{
        type: String,
    }],
    policyIdentityImage: {
        type: String
    },
    about: {
        type: String
    },
    portofolio: [{
        type: String  //array of urls
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
    },
    favouritArray: [{
        type: Number
    }],
});



UserSchema.pre("save", function (next) {
    const account = this;
    if (!account.isModified('password')) return next();

    const salt = bcrypt.genSaltSync();
    bcrypt.hash(account.password, salt).then(hash => {
        account.password = hash;
        next();
    }).catch(err => console.log(err));
});




UserSchema.methods.isValidPassword = function (newPassword, callback) {
    let user = this;
    bcrypt.compare(newPassword, user.password, function (err, isMatch) {
        if (err)
            return callback(err);
        callback(null, isMatch);
    })
};


UserSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;

        delete ret.password;
        delete ret.pushTokens;
        delete ret._id;
        delete ret.__v;
    }
});

autoIncrement.initialize(mongoose.connection);
UserSchema.plugin(autoIncrement.plugin, {
    model: 'user',
    startAt: 1,
});

export default mongoose.model("user", UserSchema);