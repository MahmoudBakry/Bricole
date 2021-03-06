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

var _specialRequest = require('../../models/special-request.model');

var _specialRequest2 = _interopRequireDefault(_specialRequest);

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
            var numberOfUsers, numberOfBricolsInCity, numberOfBricolsBtCity, numberOfSpecialRequest, numberOfBidInCity, numberOfBidBetweenCity;
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
                            return _specialRequest2.default.count();

                        case 14:
                            numberOfSpecialRequest = _context.sent;
                            _context.next = 17;
                            return _bid2.default.count({ bidType: 'bricol' });

                        case 17:
                            numberOfBidInCity = _context.sent;
                            _context.next = 20;
                            return _bid2.default.count({ bidType: 'bricol-bt-cities' });

                        case 20:
                            numberOfBidBetweenCity = _context.sent;
                            return _context.abrupt('return', res.status(200).json({
                                numberOfUsers: numberOfUsers,
                                numberOfBricolsInCity: numberOfBricolsInCity,
                                numberOfBricolsBtCity: numberOfBricolsBtCity,
                                numberOfBidInCity: numberOfBidInCity,
                                numberOfBidBetweenCity: numberOfBidBetweenCity,
                                numberOfSpecialRequest: numberOfSpecialRequest
                            }));

                        case 24:
                            _context.prev = 24;
                            _context.t0 = _context['catch'](0);

                            next(_context.t0);

                        case 27:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[0, 24]]);
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
    },


    //rertive all bricols 
    fechAllBricols: function fechAllBricols(req, res, next) {
        var _this3 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            var query, allDocs;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.prev = 0;
                            query = {};

                            if (req.query.status) query.status = req.query.status;

                            _context3.next = 5;
                            return _bricole2.default.find(query).populate('user').populate('bricoler').populate('job').sort({ creationDate: -1 });

                        case 5:
                            allDocs = _context3.sent;
                            return _context3.abrupt('return', res.status(200).json(allDocs));

                        case 9:
                            _context3.prev = 9;
                            _context3.t0 = _context3['catch'](0);

                            next(_context3.t0);

                        case 12:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, _this3, [[0, 9]]);
        }))();
    },


    //rertive all bricols 
    fechAllBricolsBtCity: function fechAllBricolsBtCity(req, res, next) {
        var _this4 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
            var query, allDocs;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.prev = 0;
                            query = {};

                            if (req.query.status) query.status = req.query.status;

                            _context4.next = 5;
                            return _bricolBtCities2.default.find(query).populate('user').populate('bricoler').populate('job').sort({ creationDate: -1 });

                        case 5:
                            allDocs = _context4.sent;
                            return _context4.abrupt('return', res.status(200).json(allDocs));

                        case 9:
                            _context4.prev = 9;
                            _context4.t0 = _context4['catch'](0);

                            next(_context4.t0);

                        case 12:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, _this4, [[0, 9]]);
        }))();
    },


    //retrive all users that have complete profile 
    fetchCompleteProfileUsers: function fetchCompleteProfileUsers(req, res, next) {
        var _this5 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
            var allDocs;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _context5.prev = 0;
                            _context5.next = 3;
                            return _user2.default.find({ completed: true }).populate('jobs').populate('city').sort({ creationDate: -1 });

                        case 3:
                            allDocs = _context5.sent;
                            return _context5.abrupt('return', res.status(200).json(allDocs));

                        case 7:
                            _context5.prev = 7;
                            _context5.t0 = _context5['catch'](0);

                            next(_context5.t0);

                        case 10:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, _this5, [[0, 7]]);
        }))();
    }
};
//# sourceMappingURL=admin.controller.js.map