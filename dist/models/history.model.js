'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseAutoIncrement = require('mongoose-auto-increment');

var _mongooseAutoIncrement2 = _interopRequireDefault(_mongooseAutoIncrement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HistorySchema = new _mongoose.Schema({
    serviceType: {
        type: String,
        enum: ['bricol', 'bricol-bt-cities', 'special-request']
    },
    service: {
        type: Number,
        refPath: 'serviceType',
        required: true
    },

    bricoler: {
        type: Number,
        ref: "user"
    },
    user: {
        type: Number,
        ref: 'user'
    },
    status: {
        type: String,
        enum: ['pendding', 'inProgress', 'assigned', 'accepted', 'ignored', 'done'],
        default: 'pendding'
    },
    creationDate: {
        type: Date,
        default: Date.now
    }

});

HistorySchema.set('toJSON', {
    transform: function transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

_mongooseAutoIncrement2.default.initialize(_mongoose2.default.connection);
HistorySchema.plugin(_mongooseAutoIncrement2.default.plugin, {
    model: 'history',
    startAt: 1
});

exports.default = _mongoose2.default.model("history", HistorySchema);
//# sourceMappingURL=history.model.js.map