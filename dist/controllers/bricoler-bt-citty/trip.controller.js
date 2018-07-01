'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _tripBtCiy = require('../../models/trip-bt-ciy.model');

var _tripBtCiy2 = _interopRequireDefault(_tripBtCiy);

var _user = require('../../models/user.model');

var _user2 = _interopRequireDefault(_user);

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

    //validation for create new bricol
    validateBody: function validateBody() {
        var isUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var validations = [(0, _check.body)("from").exists().withMessage("from is required"), (0, _check.body)("to").exists().withMessage("to is required")];
        return validations;
    },

    //create new trip logic
    createNewTrip: function createNewTrip(req, res, next) {
        var _this = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var validationErrors, bricolerId, userDetails, x, newDoc;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            validationErrors = (0, _check.validationResult)(req).array();

                            if (!(validationErrors.length > 0)) {
                                _context.next = 4;
                                break;
                            }

                            return _context.abrupt('return', next(new _ApiError2.default(422, validationErrors)));

                        case 4:
                            bricolerId = req.params.bricolerId;
                            _context.next = 7;
                            return _user2.default.findById(bricolerId);

                        case 7:
                            userDetails = _context.sent;

                            if (userDetails) {
                                _context.next = 10;
                                break;
                            }

                            return _context.abrupt('return', res.status(404).end());

                        case 10:
                            if (!(req.files.length > 0)) {
                                _context.next = 22;
                                break;
                            }

                            req.body.imgs = [];
                            x = 0;

                        case 13:
                            if (!(x < req.files.length)) {
                                _context.next = 22;
                                break;
                            }

                            _context.t0 = req.body.imgs;
                            _context.next = 17;
                            return (0, _index.toImgUrl)(req.files[x]);

                        case 17:
                            _context.t1 = _context.sent;

                            _context.t0.push.call(_context.t0, _context.t1);

                        case 19:
                            x++;
                            _context.next = 13;
                            break;

                        case 22:
                            req.body.travelingDate = parseInt(req.body.travelingDate);
                            req.body.returnDate = parseInt(req.body.returnDate);
                            req.body.bricoler = req.params.bricolerId;

                            _context.next = 27;
                            return _tripBtCiy2.default.create(req.body);

                        case 27:
                            newDoc = _context.sent;
                            return _context.abrupt('return', res.status(201).json(newDoc));

                        case 31:
                            _context.prev = 31;
                            _context.t2 = _context['catch'](0);

                            next(_context.t2);

                        case 34:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[0, 31]]);
        }))();
    },


    //retrive all trips bt cities 
    fetchAllTripsBtCities: function fetchAllTripsBtCities(req, res, next) {
        var _this2 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var limit, page, _req$query, status, from, to, tripType, query, matchQueryRegx, matchQueryRegxTo, allDocs, count;

            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;
                            limit = parseInt(req.query.limit) || 20;
                            page = req.query.page || 1;

                            //filter it 

                            _req$query = req.query, status = _req$query.status, from = _req$query.from, to = _req$query.to, tripType = _req$query.tripType;
                            query = {};


                            if (status) query.status = status;

                            if (from) {
                                matchQueryRegx = new RegExp((0, _lodash.escapeRegExp)(from), 'i');

                                query.from = matchQueryRegx;
                            }

                            if (to) {
                                matchQueryRegxTo = new RegExp((0, _lodash.escapeRegExp)(to), 'i');

                                query.to = matchQueryRegxTo;
                            }

                            if (tripType) query.tripType = tripType;

                            _context2.next = 11;
                            return _tripBtCiy2.default.find(query).populate('bricoler').skip((page - 1) * limit).limit(limit).sort({ creationDate: -1 });

                        case 11:
                            allDocs = _context2.sent;
                            _context2.next = 14;
                            return _tripBtCiy2.default.count(query);

                        case 14:
                            count = _context2.sent;
                            return _context2.abrupt('return', res.send(new _ApiResponse2.default(allDocs, page, Math.ceil(count / limit), limit, count, req)));

                        case 18:
                            _context2.prev = 18;
                            _context2.t0 = _context2['catch'](0);

                            next(_context2.t0);

                        case 21:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2, [[0, 18]]);
        }))();
    },

    //fetch all trips under one bricoler 
    fetchAllTripsForOneBricoler: function fetchAllTripsForOneBricoler(req, res, next) {
        var _this3 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            var bricolerId, limit, page, userDetails, _req$query2, status, from, to, tripType, query, matchQueryRegx, matchQueryRegxTo, allDocs, count;

            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.prev = 0;
                            bricolerId = req.params.bricolerId;
                            limit = parseInt(req.query.limit) || 20;
                            page = req.query.page || 1;
                            _context3.next = 6;
                            return _user2.default.findById(bricolerId);

                        case 6:
                            userDetails = _context3.sent;

                            if (userDetails) {
                                _context3.next = 9;
                                break;
                            }

                            return _context3.abrupt('return', res.status(404).end());

                        case 9:
                            //filter it 
                            _req$query2 = req.query, status = _req$query2.status, from = _req$query2.from, to = _req$query2.to, tripType = _req$query2.tripType;
                            query = {};


                            if (status) query.status = status;

                            if (from) {
                                matchQueryRegx = new RegExp((0, _lodash.escapeRegExp)(from), 'i');

                                query.from = matchQueryRegx;
                            }

                            if (to) {
                                matchQueryRegxTo = new RegExp((0, _lodash.escapeRegExp)(to), 'i');

                                query.to = matchQueryRegxTo;
                            }

                            if (tripType) query.tripType = tripType;
                            query.bricoler = bricolerId;

                            //data base query 
                            _context3.next = 18;
                            return _tripBtCiy2.default.find(query).populate('bricoler').skip((page - 1) * limit).limit(limit).sort({ creationDate: -1 });

                        case 18:
                            allDocs = _context3.sent;
                            _context3.next = 21;
                            return _tripBtCiy2.default.count(query);

                        case 21:
                            count = _context3.sent;
                            return _context3.abrupt('return', res.send(new _ApiResponse2.default(allDocs, page, Math.ceil(count / limit), limit, count, req)));

                        case 25:
                            _context3.prev = 25;
                            _context3.t0 = _context3['catch'](0);

                            next(_context3.t0);

                        case 28:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, _this3, [[0, 25]]);
        }))();
    }
};
//# sourceMappingURL=trip.controller.js.map