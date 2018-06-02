'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _bricolBtCities = require('../../models/bricol-bt-cities.model');

var _bricolBtCities2 = _interopRequireDefault(_bricolBtCities);

var _bid = require('../../models/bid.model');

var _bid2 = _interopRequireDefault(_bid);

var _user = require('../../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _ApiResponse = require('../../helpers/ApiResponse');

var _ApiResponse2 = _interopRequireDefault(_ApiResponse);

var _ApiError = require('../../helpers/ApiError');

var _ApiError2 = _interopRequireDefault(_ApiError);

var _index = require('../../utils/index');

var _check = require('express-validator/check');

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
    //validation for create new bricol between cities
    validateBody: function validateBody() {
        var isUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var validations = [(0, _check.body)("title").exists().withMessage("title is required"), (0, _check.body)("descripption").exists().withMessage("descripption is required"), (0, _check.body)("bricolerGender").exists().withMessage("bricolerGender is required"), (0, _check.body)("vehicleToWork").exists().withMessage("vehicleToWork is required"), (0, _check.body)("dueDate").exists().withMessage("dueDate is required"), (0, _check.body)("from").exists().withMessage("from city is required"), (0, _check.body)("to").exists().withMessage("to city location is required"), (0, _check.body)("budget").exists().withMessage("budget is required")];
        return validations;
    },


    //add new bricole between cities 
    createNewBricole: function createNewBricole(req, res, next) {
        var _this = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var validationErrors, x, newDoc, newDocDetails;
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
                            if (!(req.files.length > 0)) {
                                _context.next = 18;
                                break;
                            }

                            req.body.imgs = [];
                            x = 0;

                        case 7:
                            if (!(x < req.files.length)) {
                                _context.next = 16;
                                break;
                            }

                            _context.t0 = req.body.imgs;
                            _context.next = 11;
                            return (0, _index.toImgUrl)(req.files[x]);

                        case 11:
                            _context.t1 = _context.sent;

                            _context.t0.push.call(_context.t0, _context.t1);

                        case 13:
                            x++;
                            _context.next = 7;
                            break;

                        case 16:
                            _context.next = 19;
                            break;

                        case 18:
                            return _context.abrupt('return', next(new _ApiError2.default(422, "imgs are required")));

                        case 19:
                            req.body.dueDate = parseInt(req.body.dueDate);
                            req.body.user = req.user._id;
                            _context.next = 23;
                            return _bricolBtCities2.default.create(req.body);

                        case 23:
                            newDoc = _context.sent;
                            _context.next = 26;
                            return _bricolBtCities2.default.findById(newDoc.id).populate('user');

                        case 26:
                            newDocDetails = _context.sent;
                            return _context.abrupt('return', res.status(201).json(newDocDetails));

                        case 30:
                            _context.prev = 30;
                            _context.t2 = _context['catch'](0);

                            next(_context.t2);

                        case 33:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[0, 30]]);
        }))();
    },


    //retrive one bricole details 
    retriveOneBricoleDetails: function retriveOneBricoleDetails(req, res, next) {
        var _this2 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var bricolId, docDetails, query, bidCount;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;
                            bricolId = req.params.bricolId;
                            _context2.next = 4;
                            return _bricolBtCities2.default.findById(bricolId).populate('user').populate('bricoler');

                        case 4:
                            docDetails = _context2.sent;

                            if (docDetails) {
                                _context2.next = 7;
                                break;
                            }

                            return _context2.abrupt('return', res.status(404).end());

                        case 7:
                            query = {
                                bricol: bricolId,
                                bidType: 'betweenCity'
                            };
                            _context2.next = 10;
                            return _bid2.default.count(query);

                        case 10:
                            bidCount = _context2.sent;
                            return _context2.abrupt('return', res.status(200).json({ bricol: docDetails, bidCount: bidCount }));

                        case 14:
                            _context2.prev = 14;
                            _context2.t0 = _context2['catch'](0);

                            next(_context2.t0);

                        case 17:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2, [[0, 14]]);
        }))();
    },


    //fetch all bricoles 
    retriveAllBricol: function retriveAllBricol(req, res, next) {
        var _this3 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            var _req$query, vehicleToWork, bricolerGender, startPrice, endPrice, query, matchQueryRegx, sort, limit, page, allDocs, result, x, bidQuery, countOfBids, count;

            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.prev = 0;
                            _req$query = req.query, vehicleToWork = _req$query.vehicleToWork, bricolerGender = _req$query.bricolerGender, startPrice = _req$query.startPrice, endPrice = _req$query.endPrice;
                            query = {};

                            //filter by vehicleToWork

                            if (vehicleToWork) {
                                vehicleToWork = vehicleToWork.split(',');
                                if (vehicleToWork.length > 1) query.vehicleToWork = { $in: vehicleToWork };else query.vehicleToWork = vehicleToWork[0];
                            }
                            //filter by bricolerGender
                            if (bricolerGender) query.bricolerGender = bricolerGender;
                            //filteration by start & end price [budget]
                            if (startPrice) query.budget = { $gte: +startPrice };
                            if (endPrice) query.budget = _extends({}, query.budget, { $lte: +endPrice });
                            //search by word in title of bricol 
                            if (req.query.q) {
                                matchQueryRegx = new RegExp((0, _lodash.escapeRegExp)(req.query.q), 'i');

                                query.title = matchQueryRegx;
                            }

                            //sorted docs
                            sort = {};

                            sort.creationDate = -1;
                            if (req.query.maxPrice) {

                                sort.budget = -1;
                            }

                            if (req.query.minPrice) {
                                console.log('d');
                                sort.budget = 1;
                            }

                            limit = parseInt(req.query.limit) || 20;
                            page = req.query.page || 1;
                            _context3.next = 16;
                            return _bricolBtCities2.default.find(query).populate('user').skip((page - 1) * limit).limit(limit).sort(sort);

                        case 16:
                            allDocs = _context3.sent;


                            //prepare response 
                            result = [];
                            x = 0;

                        case 19:
                            if (!(x < allDocs.length)) {
                                _context3.next = 28;
                                break;
                            }

                            //get count of bids for each bricol
                            bidQuery = {
                                bricol: allDocs[x].id,
                                bidType: 'betweenCity'
                            };
                            _context3.next = 23;
                            return _bid2.default.count(bidQuery);

                        case 23:
                            countOfBids = _context3.sent;

                            result.push({ bricol: allDocs[x], countOfBids: countOfBids });

                        case 25:
                            x++;
                            _context3.next = 19;
                            break;

                        case 28:
                            _context3.next = 30;
                            return _bricolBtCities2.default.count(query);

                        case 30:
                            count = _context3.sent;
                            return _context3.abrupt('return', res.send(new _ApiResponse2.default(result, page, Math.ceil(count / limit), limit, count, req)));

                        case 34:
                            _context3.prev = 34;
                            _context3.t0 = _context3['catch'](0);

                            next(_context3.t0);

                        case 37:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, _this3, [[0, 34]]);
        }))();
    }
};
//# sourceMappingURL=bricol-bt-cities.controller.js.map