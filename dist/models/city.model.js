'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseAutoIncrement = require('mongoose-auto-increment');

var _mongooseAutoIncrement2 = _interopRequireDefault(_mongooseAutoIncrement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CitySchema = new _mongoose.Schema({
    name: {
        type: String,
        required: true
    }

});

CitySchema.set('toJSON', {
    transform: function transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

_mongooseAutoIncrement2.default.initialize(_mongoose2.default.connection);
CitySchema.plugin(_mongooseAutoIncrement2.default.plugin, {
    model: 'city',
    startAt: 1
});

exports.default = _mongoose2.default.model("city", CitySchema);
//# sourceMappingURL=city.model.js.map