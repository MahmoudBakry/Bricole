'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _bricole = require('../models/bricole.model');

var _bricole2 = _interopRequireDefault(_bricole);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _ApiResponse = require('../helpers/ApiResponse');

var _ApiResponse2 = _interopRequireDefault(_ApiResponse);

var _ApiError = require('../helpers/ApiError');

var _ApiError2 = _interopRequireDefault(_ApiError);

var _index = require('../utils/index');

var _check = require('express-validator/check');

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var deg2rad = function deg2rad(deg) {
    return deg * (Math.PI / 180);
};

exports.default = {

    //validation for create new bricol
    validateBody: function validateBody() {
        var isUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var validations = [(0, _check.body)("title").exists().withMessage("title is required"), (0, _check.body)("descripption").exists().withMessage("descripption is required"), (0, _check.body)('lang').exists().withMessage("lang  is required"), (0, _check.body)("lat").exists().withMessage("lat is required"), (0, _check.body)("bricolerGender").exists().withMessage("bricolerGender is required"), (0, _check.body)("vehicleToWork").exists().withMessage("vehicleToWork is required"), (0, _check.body)("dueDate").exists().withMessage("dueDate is required")];
        return validations;
    },


    //logic add new bricol
    addNewBricol: function addNewBricol(req, res, next) {
        var _this = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var validationErrors, x, lang, lat, bricolLocation, newDoc, createdDoc;
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
                            lang = req.body.lang; //long

                            lat = req.body.lat; //lat

                            bricolLocation = [lang, lat]; //modify location 

                            req.body.location = bricolLocation;
                            req.body.user = req.user._id;
                            req.body.dueDate = parseInt(req.body.dueDate);

                            _context.next = 27;
                            return _bricole2.default.create(req.body);

                        case 27:
                            newDoc = _context.sent;
                            _context.next = 30;
                            return _bricole2.default.findById(newDoc.id).populate('user').populate('job');

                        case 30:
                            createdDoc = _context.sent;
                            return _context.abrupt('return', res.status(201).json(createdDoc));

                        case 34:
                            _context.prev = 34;
                            _context.t2 = _context['catch'](0);

                            next(_context.t2);

                        case 37:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[0, 34]]);
        }))();
    },


    //fetch all bricoles 
    retriveAllBricol: function retriveAllBricol(req, res, next) {
        var _this2 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var _req$query, vehicleToWork, job, bricolerGender, startPrice, endPrice, query, matchQueryRegx, sort, limit, page, allDocs, count;

            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;
                            _req$query = req.query, vehicleToWork = _req$query.vehicleToWork, job = _req$query.job, bricolerGender = _req$query.bricolerGender, startPrice = _req$query.startPrice, endPrice = _req$query.endPrice;
                            query = {};
                            //filter by jobs

                            if (job) {
                                job = job.split(',');
                                if (job.length > 1) query.job = { $in: job };else query.job = job[0];
                            }
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

                            if (req.query.maxPrice) {
                                sort.budget = -1;
                                sort.creationDate = -1;
                            }

                            if (req.query.minPrice) {
                                sort.budget = 1;
                                sort.creationDate = -1;
                            }
                            limit = parseInt(req.query.limit) || 20;
                            page = req.query.page || 1;
                            _context2.next = 16;
                            return _bricole2.default.find(query).populate('user').populate('job').skip((page - 1) * limit).limit(limit).sort(sort);

                        case 16:
                            allDocs = _context2.sent;
                            _context2.next = 19;
                            return _bricole2.default.count(query);

                        case 19:
                            count = _context2.sent;
                            return _context2.abrupt('return', res.send(new _ApiResponse2.default(allDocs, page, Math.ceil(count / limit), limit, count, req)));

                        case 23:
                            _context2.prev = 23;
                            _context2.t0 = _context2['catch'](0);

                            next(_context2.t0);

                        case 26:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2, [[0, 23]]);
        }))();
    },

    //validation input of calulate price 
    validateBodyOfCalulatePrice: function validateBodyOfCalulatePrice() {
        return [(0, _check.body)("bricol").exists().withMessage("bricol location is required"), (0, _check.body)("user").exists().withMessage("user location is required")];
    },

    //calculate distance between bricole and user 
    calculateDistance: function calculateDistance(req, res, next) {
        var _this3 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            var validationErrors, lang1, lat1, lang2, lat2, R, dLat, dLon, a, c, d;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.prev = 0;
                            validationErrors = (0, _check.validationResult)(req).array();

                            if (!(validationErrors.length > 0)) {
                                _context3.next = 4;
                                break;
                            }

                            return _context3.abrupt('return', next(new _ApiError2.default(422, validationErrors)));

                        case 4:
                            //first locattion point
                            lang1 = parseFloat(req.body.bricol.lang);
                            lat1 = parseFloat(req.body.bricol.lat);
                            //scound location point

                            lang2 = parseFloat(req.body.user.lang);
                            lat2 = parseFloat(req.body.user.lat);
                            R = 6371; // Radius of the earth in km

                            dLat = deg2rad(lat2 - lat1); // deg2rad above

                            dLon = deg2rad(lang2 - lang1);
                            a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
                            c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                            d = R * c; // Distance in km

                            console.log(d);
                            return _context3.abrupt('return', res.status(200).json({ distanceInKm: d }));

                        case 18:
                            _context3.prev = 18;
                            _context3.t0 = _context3['catch'](0);

                            next(_context3.t0);

                        case 21:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, _this3, [[0, 18]]);
        }))();
    }
};
//# sourceMappingURL=bricol.controller.js.map