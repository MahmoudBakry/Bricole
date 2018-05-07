'use strict';

require('babel-polyfill');

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Port = process.env.PORT || 3000;

_app2.default.listen(Port, function () {
    console.log('server is running now in port... ' + Port);
});
//# sourceMappingURL=index.js.map