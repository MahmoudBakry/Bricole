'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseAutoIncrement = require('mongoose-auto-increment');

var _mongooseAutoIncrement2 = _interopRequireDefault(_mongooseAutoIncrement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BricolBtCitiesSchema = new _mongoose.Schema({
    user: {
        type: Number,
        ref: 'user',
        required: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    typeOfBricole: {
        type: String,
        enum: ['inCity', 'betweenCity'],
        default: 'betweenCity'
    },
    title: {
        type: String,
        required: true
    },
    descripption: {
        type: String,
        required: true
    },
    bricolerGender: {
        type: String,
        enum: ['male', 'female', 'both'],
        required: true
    },
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
    budget: {
        type: Number
    },
    tripType: {
        type: String,
        enum: ['one way', 'two way'],
        default: 'one way'
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

BricolBtCitiesSchema.set('toJSON', {
    transform: function transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

_mongooseAutoIncrement2.default.initialize(_mongoose2.default.connection);
BricolBtCitiesSchema.plugin(_mongooseAutoIncrement2.default.plugin, {
    model: 'bricol-bt-cities',
    startAt: 1
});

exports.default = _mongoose2.default.model("bricol-bt-cities", BricolBtCitiesSchema);
//# sourceMappingURL=bricol-bt-cities.model.js.map