'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _history = require('../models/history.model');

var _history2 = _interopRequireDefault(_history);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _ApiResponse = require('../helpers/ApiResponse');

var _ApiResponse2 = _interopRequireDefault(_ApiResponse);

var _ApiError = require('../helpers/ApiError');

var _ApiError2 = _interopRequireDefault(_ApiError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
    //retrive all bricole history 
    retriveHistory: function retriveHistory(req, res, next) {
        var _this = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var allDoc;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            _context.next = 3;
                            return _history2.default.find().populate('service');

                        case 3:
                            allDoc = _context.sent;
                            return _context.abrupt('return', res.status(200).json(allDoc));

                        case 7:
                            _context.prev = 7;
                            _context.t0 = _context['catch'](0);

                            next(_context.t0);

                        case 10:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[0, 7]]);
        }))();
    }
};
//# sourceMappingURL=history.controller.js.map