'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseAutoIncrement = require('mongoose-auto-increment');

var _mongooseAutoIncrement2 = _interopRequireDefault(_mongooseAutoIncrement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TripBtCitySchema = new _mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    bricoler: {
        type: Number,
        ref: 'user',
        required: true
    },
    tripType: {
        type: String,
        enum: ['one way', 'two way'],
        default: 'one way'
    },
    duration: {
        type: Number
    },
    typeOfDuration: {
        type: String,
        enum: ['day', 'week', 'month'],
        default: 'day'
    },
    travelingDate: {
        type: Date
    },
    returnDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['prepare', 'onTrip', 'finished'],
        default: 'prepare'
    },
    imgs: [{
        type: String
    }],
    creationDate: {
        type: Date,
        default: Date.now
    }
});

TripBtCitySchema.set('toJSON', {
    transform: function transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

_mongooseAutoIncrement2.default.initialize(_mongoose2.default.connection);
TripBtCitySchema.plugin(_mongooseAutoIncrement2.default.plugin, {
    model: 'trip-bt-city',
    startAt: 1
});

exports.default = _mongoose2.default.model("trip-bt-city", TripBtCitySchema);
//# sourceMappingURL=trip-bt-ciy.model.js.map