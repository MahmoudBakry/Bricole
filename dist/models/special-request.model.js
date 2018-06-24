'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseAutoIncrement = require('mongoose-auto-increment');

var _mongooseAutoIncrement2 = _interopRequireDefault(_mongooseAutoIncrement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var specialRequest = new _mongoose.Schema({
    user: {
        type: Number,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: [Number], // Don't forget [0=>longitude,1=>latitude]
        required: true,
        index: '2d'
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
        enum: ['pendding', 'accepted', 'ignored', 'done'],
        default: 'pendding'
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
});

specialRequest.set('toJSON', {
    transform: function transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

_mongooseAutoIncrement2.default.initialize(_mongoose2.default.connection);
specialRequest.plugin(_mongooseAutoIncrement2.default.plugin, {
    model: 'special-request',
    startAt: 1
});

exports.default = _mongoose2.default.model("special-request", specialRequest);
//# sourceMappingURL=special-request.model.js.map