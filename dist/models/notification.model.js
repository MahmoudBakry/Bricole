'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseAutoIncrement = require('mongoose-auto-increment');

var _mongooseAutoIncrement2 = _interopRequireDefault(_mongooseAutoIncrement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NotificationSchema = new _mongoose.Schema({
    targetUser: {
        type: Number,
        ref: 'user',
        required: true
    },
    subjectType: {
        type: String,
        enum: ['bricol', 'bricol-bt-cities', 'bid', 'request-trip-bt-city', 'special-request', 'trip-bt-city']
    },
    subject: {
        type: Number,
        refPath: 'subjectType'
    },
    text: {
        type: String,
        required: true
    },
    seen: {
        type: Boolean,
        default: false
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
});

NotificationSchema.set('toJSON', {
    transform: function transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

_mongooseAutoIncrement2.default.initialize(_mongoose2.default.connection);
NotificationSchema.plugin(_mongooseAutoIncrement2.default.plugin, {
    model: 'order-notificaton',
    startAt: 1
});

exports.default = _mongoose2.default.model("order-notificaton", NotificationSchema);
//# sourceMappingURL=notification.model.js.map