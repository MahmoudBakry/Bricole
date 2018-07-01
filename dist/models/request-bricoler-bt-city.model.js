'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseAutoIncrement = require('mongoose-auto-increment');

var _mongooseAutoIncrement2 = _interopRequireDefault(_mongooseAutoIncrement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RequestTripSchema = new _mongoose.Schema({
    title: {
        type: String
    },
    descripion: {
        type: String

    },
    budget: {
        type: Number
    },
    user: {
        type: Number,
        ref: 'user'
    },
    trip: {
        type: Number,
        ref: 'trip-bt-city'
    },
    status: {
        type: String,
        enum: ['pendding', 'accept', 'ignore', 'done'],
        default: 'pendding'
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
});

RequestTripSchema.set('toJSON', {
    transform: function transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

_mongooseAutoIncrement2.default.initialize(_mongoose2.default.connection);
RequestTripSchema.plugin(_mongooseAutoIncrement2.default.plugin, {
    model: 'request-trip-bt-city',
    startAt: 1
});

exports.default = _mongoose2.default.model("request-trip-bt-city", RequestTripSchema);
//# sourceMappingURL=request-bricoler-bt-city.model.js.map