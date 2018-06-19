'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _user = require('../../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _bricole = require('../../models/bricole.model');

var _bricole2 = _interopRequireDefault(_bricole);

var _bricolBtCities = require('../../models/bricol-bt-cities.model');

var _bricolBtCities2 = _interopRequireDefault(_bricolBtCities);

var _bid = require('../../models/bid.model');

var _bid2 = _interopRequireDefault(_bid);

var _ApiError = require('../../helpers/ApiError');

var _ApiError2 = _interopRequireDefault(_ApiError);

var _ApiResponse = require('../../helpers/ApiResponse');

var _ApiResponse2 = _interopRequireDefault(_ApiResponse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {

    //retrive some statistics 
    retriveSomeNumbers: function retriveSomeNumbers(req, res, next) {
        var _this = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var numberOfUsers, numberOfBricolsInCity, numberOfBricolsBtCity, numberOfBidInCity, numberOfBidBetweenCity;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;

                            if (!(req.user.type !== "ADMIN")) {
                                _context.next = 3;
                                break;
                            }

                            return _context.abrupt('return', next(new _ApiError2.default(403, 'Not Admin User')));

                        case 3:
                            _context.next = 5;
                            return _user2.default.count();

                        case 5:
                            numberOfUsers = _context.sent;
                            _context.next = 8;
                            return _bricole2.default.count();

                        case 8:
                            numberOfBricolsInCity = _context.sent;
                            _context.next = 11;
                            return _bricolBtCities2.default.count();

                        case 11:
                            numberOfBricolsBtCity = _context.sent;
                            _context.next = 14;
                            return _bid2.default.count({ bidType: 'bricol' });

                        case 14:
                            numberOfBidInCity = _context.sent;
                            _context.next = 17;
                            return _bid2.default.count({ bidType: 'bricol-bt-cities' });

                        case 17:
                            numberOfBidBetweenCity = _context.sent;
                            return _context.abrupt('return', res.status(200).json({
                                numberOfUsers: numberOfUsers,
                                numberOfBricolsInCity: numberOfBricolsInCity,
                                numberOfBricolsBtCity: numberOfBricolsBtCity,
                                numberOfBidInCity: numberOfBidInCity,
                                numberOfBidBetweenCity: numberOfBidBetweenCity
                            }));

                        case 21:
                            _context.prev = 21;
                            _context.t0 = _context['catch'](0);

                            next(_context.t0);

                        case 24:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[0, 21]]);
        }))();
    },


    //fetch all users 
    retriveAllUsers: function retriveAllUsers(req, res, next) {
        var _this2 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var allDocs;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;

                            if (!(req.user.type !== "ADMIN")) {
                                _context2.next = 3;
                                break;
                            }

                            return _context2.abrupt('return', next(new _ApiError2.default(403, 'Not Admin User')));

                        case 3:
                            _context2.next = 5;
                            return _user2.default.find().populate('jobs').populate('city').sort({ creationDate: -1 });

                        case 5:
                            allDocs = _context2.sent;
                            return _context2.abrupt('return', res.status(200).json(allDocs));

                        case 9:
                            _context2.prev = 9;
                            _context2.t0 = _context2['catch'](0);

                            next(_context2.t0);

                        case 12:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2, [[0, 9]]);
        }))();
    }
};
//# sourceMappingURL=admin.controller.js.map