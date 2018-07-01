'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _tripBtCiy = require('../../models/trip-bt-ciy.model');

var _tripBtCiy2 = _interopRequireDefault(_tripBtCiy);

var _user = require('../../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _requestBricolerBtCity = require('../../models/request-bricoler-bt-city.model');

var _requestBricolerBtCity2 = _interopRequireDefault(_requestBricolerBtCity);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _ApiResponse = require('../../helpers/ApiResponse');

var _ApiResponse2 = _interopRequireDefault(_ApiResponse);

var _ApiError = require('../../helpers/ApiError');

var _ApiError2 = _interopRequireDefault(_ApiError);

var _check = require('express-validator/check');

var _index = require('../../utils/index');

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
    createNewRequest: function createNewRequest(req, res, next) {
        var _this = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var tripId, tripDetails, newDoc;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            tripId = req.params.tripId;
                            _context.next = 4;
                            return _tripBtCiy2.default.findById(tripId);

                        case 4:
                            tripDetails = _context.sent;

                            if (tripDetails) {
                                _context.next = 7;
                                break;
                            }

                            return _context.abrupt('return', res.status(404).end());

                        case 7:
                            //prepare data 
                            req.body.trip = tripId;
                            req.body.user = req.user._id;
                            //data base query
                            _context.next = 11;
                            return _requestBricolerBtCity2.default.create(req.body);

                        case 11:
                            newDoc = _context.sent;
                            return _context.abrupt('return', res.status(201).json(newDoc));

                        case 15:
                            _context.prev = 15;
                            _context.t0 = _context['catch'](0);

                            next(_context.t0);

                        case 18:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[0, 15]]);
        }))();
    },

    //retrive all request under one trip 
    retriveAllRequestUnderOneTrip: function retriveAllRequestUnderOneTrip(req, res, next) {
        var _this2 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var limit, page, tripId, tripDetails, query, allDocs, count;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;
                            limit = parseInt(req.query.limit) || 20;
                            page = req.query.page || 1;
                            tripId = req.params.tripId;
                            _context2.next = 6;
                            return _tripBtCiy2.default.findById(tripId);

                        case 6:
                            tripDetails = _context2.sent;

                            if (tripDetails) {
                                _context2.next = 9;
                                break;
                            }

                            return _context2.abrupt('return', res.status(404).end());

                        case 9:
                            query = {};

                            query.trip = tripId;

                            _context2.next = 13;
                            return _requestBricolerBtCity2.default.find(query).populate('trip').populate('user').skip((page - 1) * limit).limit(limit).sort({ creationDate: -1 });

                        case 13:
                            allDocs = _context2.sent;
                            _context2.next = 16;
                            return _requestBricolerBtCity2.default.count(query);

                        case 16:
                            count = _context2.sent;
                            return _context2.abrupt('return', res.send(new _ApiResponse2.default(allDocs, page, Math.ceil(count / limit), limit, count, req)));

                        case 20:
                            _context2.prev = 20;
                            _context2.t0 = _context2['catch'](0);

                            next(_context2.t0);

                        case 23:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2, [[0, 20]]);
        }))();
    },


    //retrive one Request 
    retriveOneRequest: function retriveOneRequest(req, res, next) {
        var _this3 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            var tripId, tripDetails, requestId, requestDetails;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.prev = 0;
                            tripId = req.params.tripId;
                            _context3.next = 4;
                            return _tripBtCiy2.default.findById(tripId);

                        case 4:
                            tripDetails = _context3.sent;

                            if (tripDetails) {
                                _context3.next = 7;
                                break;
                            }

                            return _context3.abrupt('return', res.status(404).end());

                        case 7:
                            requestId = req.params.requestId;
                            _context3.next = 10;
                            return _requestBricolerBtCity2.default.findById(requestId).populate('trip').populate('user');

                        case 10:
                            requestDetails = _context3.sent;
                            return _context3.abrupt('return', res.status(200).json(requestDetails));

                        case 14:
                            _context3.prev = 14;
                            _context3.t0 = _context3['catch'](0);

                            next(_context3.t0);

                        case 17:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, _this3, [[0, 14]]);
        }))();
    },


    //accept request 
    acceptRequest: function acceptRequest(req, res, next) {
        var _this4 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
            var tripId, tripDetails, requestId, requestDetails, newDoc;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.prev = 0;
                            tripId = req.params.tripId;
                            _context4.next = 4;
                            return _tripBtCiy2.default.findById(tripId);

                        case 4:
                            tripDetails = _context4.sent;

                            if (tripDetails) {
                                _context4.next = 7;
                                break;
                            }

                            return _context4.abrupt('return', res.status(404).end());

                        case 7:
                            requestId = req.params.requestId;
                            _context4.next = 10;
                            return _requestBricolerBtCity2.default.findById(requestId);

                        case 10:
                            requestDetails = _context4.sent;

                            if (requestDetails) {
                                _context4.next = 13;
                                break;
                            }

                            return _context4.abrupt('return', res.status(404).end());

                        case 13:

                            //update status
                            requestDetails.status = 'accept';
                            _context4.next = 16;
                            return requestDetails.save();

                        case 16:
                            _context4.next = 18;
                            return _requestBricolerBtCity2.default.findById(requestDetails.id);

                        case 18:
                            newDoc = _context4.sent;
                            return _context4.abrupt('return', res.status(200).json(newDoc));

                        case 22:
                            _context4.prev = 22;
                            _context4.t0 = _context4['catch'](0);

                            next(_context4.t0);

                        case 25:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, _this4, [[0, 22]]);
        }))();
    },

    //ignore request 
    ignoreRequest: function ignoreRequest(req, res, next) {
        var _this5 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
            var tripId, tripDetails, requestId, requestDetails, newDoc;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _context5.prev = 0;
                            tripId = req.params.tripId;
                            _context5.next = 4;
                            return _tripBtCiy2.default.findById(tripId);

                        case 4:
                            tripDetails = _context5.sent;

                            if (tripDetails) {
                                _context5.next = 7;
                                break;
                            }

                            return _context5.abrupt('return', res.status(404).end());

                        case 7:
                            requestId = req.params.requestId;
                            _context5.next = 10;
                            return _requestBricolerBtCity2.default.findById(requestId);

                        case 10:
                            requestDetails = _context5.sent;

                            if (requestDetails) {
                                _context5.next = 13;
                                break;
                            }

                            return _context5.abrupt('return', res.status(404).end());

                        case 13:

                            //update status
                            requestDetails.status = 'ignore';
                            _context5.next = 16;
                            return requestDetails.save();

                        case 16:
                            _context5.next = 18;
                            return _requestBricolerBtCity2.default.findById(requestDetails.id);

                        case 18:
                            newDoc = _context5.sent;
                            return _context5.abrupt('return', res.status(200).json(newDoc));

                        case 22:
                            _context5.prev = 22;
                            _context5.t0 = _context5['catch'](0);

                            next(_context5.t0);

                        case 25:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, _this5, [[0, 22]]);
        }))();
    }
};
//# sourceMappingURL=request-trip.controller.js.map