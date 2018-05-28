'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseAutoIncrement = require('mongoose-auto-increment');

var _mongooseAutoIncrement2 = _interopRequireDefault(_mongooseAutoIncrement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BricolSchema = new _mongoose.Schema({
    user: {
        type: Number,
        ref: 'user',
        required: true
    },
    typeOfBricole: {
        type: String,
        enum: ['inCity', 'betweenCity'],
        default: 'inCity'
    },
    title: {
        type: String,
        required: true
    },
    descripption: {
        type: String,
        required: true
    },
    location: {
        type: [Number], // Don't forget [0=>longitude,1=>latitude]
        required: true,
        index: '2d'
    },
    bricolerGender: {
        type: String,
        enum: ['male', 'female', 'both'],
        required: true
    },
    completedOnline: {
        type: Boolean,
        default: false
    },
    job: [{
        type: Number,
        ref: "job"
    }],
    vehicleToWork: [{
        type: String,
        required: true
    }],
    numberOfBricolers: {
        type: Number
    },
    imgs: [{
        type: String
    }],
    dueDate: {
        type: Date,
        required: true
    },
    expiredAfter: {
        type: Number
    },
    typeOfexpiredAfter: {
        type: String,
        enum: ['day', 'houre', 'week', 'month']
    },
    budget: {
        type: Number
    },
    typeOfBudget: {
        type: String,
        enum: ['fixed', 'monthly', 'weekly']
    },
    bricoler: {
        type: Number,
        ref: 'user'
    },
    status: {
        type: String,
        enum: ['pendding', 'assigned', 'inProgress', 'done'],
        default: 'pendding'
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
});

BricolSchema.set('toJSON', {
    transform: function transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

_mongooseAutoIncrement2.default.initialize(_mongoose2.default.connection);
BricolSchema.plugin(_mongooseAutoIncrement2.default.plugin, {
    model: 'bricol',
    startAt: 1
});

exports.default = _mongoose2.default.model("bricol", BricolSchema);
//# sourceMappingURL=bricole.model.js.map