'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseAutoIncrement = require('mongoose-auto-increment');

var _mongooseAutoIncrement2 = _interopRequireDefault(_mongooseAutoIncrement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BidSchema = new _mongoose.Schema({
    user: {
        type: Number,
        required: true,
        ref: 'user'
    },
    bricol: {
        type: Number,
        ref: 'bricol',
        required: true
    },
    offerDescription: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pendding', 'accepted', 'refused'],
        default: 'pendding'
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
});

BidSchema.set('toJSON', {
    transform: function transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

_mongooseAutoIncrement2.default.initialize(_mongoose2.default.connection);
BidSchema.plugin(_mongooseAutoIncrement2.default.plugin, {
    model: 'bid',
    startAt: 1
});

exports.default = _mongoose2.default.model("bid", BidSchema);
//# sourceMappingURL=bid.model.js.map