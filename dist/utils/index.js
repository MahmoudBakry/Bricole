'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toImgUrl = undefined;

// Convert Local Upload To Cloudinary Url
var toImgUrl = exports.toImgUrl = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(multerObject) {
    var result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return cloudinary.v2.uploader.upload(multerObject.path);

          case 3:
            result = _context.sent;


            console.log('imgUrl: ', result.secure_url);
            return _context.abrupt('return', result.secure_url);

          case 8:
            _context.prev = 8;
            _context.t0 = _context['catch'](0);

            console.log('Cloudinary Error: ', _context.t0);
            throw new _ApiError2.default(500, 'Failed To Upload Image due to network issue! Retry again...');

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 8]]);
  }));

  return function toImgUrl(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _ApiError = require('../helpers/ApiError');

var _ApiError2 = _interopRequireDefault(_ApiError);

var _cloudinary = require('cloudinary');

var cloudinary = _interopRequireWildcard(_cloudinary);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

cloudinary.config(_config2.default.cloudinary);
//# sourceMappingURL=index.js.map