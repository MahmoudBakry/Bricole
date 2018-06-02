'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _bricole = require('../models/bricole.model');

var _bricole2 = _interopRequireDefault(_bricole);

var _bid = require('../models/bid.model');

var _bid2 = _interopRequireDefault(_bid);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _check = require('express-validator/check');

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _ApiError = require('../helpers/ApiError');

var _ApiError2 = _interopRequireDefault(_ApiError);

var _multer = require('../services/multer');

var _index = require('../utils/index');

var _ApiResponse = require('../helpers/ApiResponse');

var _ApiResponse2 = _interopRequireDefault(_ApiResponse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var jwtSecret = _config2.default.jwtSecret;

var generateToken = function generateToken(id) {

    return _jsonwebtoken2.default.sign({
        sub: id,
        iss: 'App',
        iat: new Date().getTime()
    }, jwtSecret, { expiresIn: '10000s' });
};

//function check phone regular exression 
//this function support 
// +XX-XXXX-XXXX  
// +XX.XXXX.XXXX  
// +XX XXXX XXXX 
var checkPhone = function checkPhone(inputtxt) {
    var phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (inputtxt.match(phoneno)) {
        return true;
    } else {
        throw new Error("invalid phone");
    }
};
exports.default = {
    validateBody: function validateBody() {
        var _this = this;

        var isUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        return [(0, _check.body)("userName").exists().withMessage("userName is required"), (0, _check.body)("jobs").exists().withMessage("jobs is required"), (0, _check.body)("lang").exists().withMessage("lang is required"), (0, _check.body)("lat").exists().withMessage("lat is required"), (0, _check.body)("vehicleToWork").exists().withMessage("vehicleToWork is required"), (0, _check.body)("firstName").exists().withMessage("firstName is required"), (0, _check.body)("lastName").exists().withMessage("lastName is required"), (0, _check.body)("city").exists().withMessage("city is required"), (0, _check.body)("password").exists().withMessage("password is required"), (0, _check.body)("phone").exists().withMessage("phone is requires")
        //make custome validation to phone to check on phone[unique, isPhone]
        .custom(function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(value, _ref2) {
                var req = _ref2.req;
                var userPhoneQuery, user;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                //call phone checking pattren function 
                                checkPhone(value);
                                if (isUpdate && req.user.phone == value) userQuery._id = { $ne: req.user._id };
                                userPhoneQuery = { phone: value };
                                _context.next = 5;
                                return _user2.default.findOne(userPhoneQuery);

                            case 5:
                                user = _context.sent;

                                if (!user) {
                                    _context.next = 10;
                                    break;
                                }

                                throw new Error('phone already exists');

                            case 10:
                                return _context.abrupt('return', true);

                            case 11:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, _this);
            }));

            return function (_x2, _x3) {
                return _ref.apply(this, arguments);
            };
        }())];
    },

    //signup logic 
    signUp: function signUp(req, res, next) {
        var _this2 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var validationErrors, lang, lat, userLocation, createdUser, newUser;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            validationErrors = (0, _check.validationResult)(req).array();

                            if (!(validationErrors.length > 0)) {
                                _context2.next = 3;
                                break;
                            }

                            return _context2.abrupt('return', next(new _ApiError2.default(422, validationErrors)));

                        case 3:
                            _context2.prev = 3;

                            if (!req.file) {
                                _context2.next = 8;
                                break;
                            }

                            _context2.next = 7;
                            return (0, _index.toImgUrl)(req.file);

                        case 7:
                            req.body.img = _context2.sent;

                        case 8:
                            lang = req.body.lang; //long

                            lat = req.body.lat; //lat

                            userLocation = [lang, lat]; //modify location 

                            req.body.location = userLocation;

                            req.body.birthDate = parseInt(req.body.birthDate);
                            _context2.next = 15;
                            return _user2.default.create(req.body);

                        case 15:
                            createdUser = _context2.sent;
                            _context2.next = 18;
                            return _user2.default.findById(createdUser.id).populate('city').populate('jobs');

                        case 18:
                            newUser = _context2.sent;

                            res.status(201).send({ user: newUser, token: generateToken(createdUser.id) });
                            _context2.next = 25;
                            break;

                        case 22:
                            _context2.prev = 22;
                            _context2.t0 = _context2['catch'](3);

                            next(_context2.t0);

                        case 25:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2, [[3, 22]]);
        }))();
    },

    //sign in logic 
    signin: function signin(req, res, next) {
        var _this3 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            var userDetails, user;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            userDetails = req.user; // Passport

                            console.log(userDetails.type);
                            _context3.next = 4;
                            return _user2.default.findById(userDetails.id).populate('city').populate('jobs');

                        case 4:
                            user = _context3.sent;

                            res.send({ user: user, token: generateToken(userDetails.id) });

                        case 6:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, _this3);
        }))();
    },


    //retrive all bricols under one user 
    fetchAllBricolOfOneUser: function fetchAllBricolOfOneUser(req, res, next) {
        var _this4 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
            var limit, page, userId, query, allBricols, result, x, _query, countBids, count;

            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.prev = 0;

                            console.log('s');
                            limit = parseInt(req.query.limit) || 20;
                            page = req.query.page || 1;
                            userId = req.params.userId;
                            query = {};

                            if (req.query.status) query.status = req.query.status;
                            query.user = userId;
                            _context4.next = 10;
                            return _bricole2.default.find(query).populate('user').populate('job').populate('bricoler').skip((page - 1) * limit).limit(limit).sort({ creationDate: -1 });

                        case 10:
                            allBricols = _context4.sent;
                            result = [];
                            x = 0;

                        case 13:
                            if (!(x < allBricols.length)) {
                                _context4.next = 24;
                                break;
                            }

                            _query = {};

                            _query.bricol = allBricols[x].id;
                            _query.bidType = 'inCity';
                            _context4.next = 19;
                            return _bid2.default.count(_query);

                        case 19:
                            countBids = _context4.sent;

                            result.push({ bricol: allBricols[x], countBids: countBids });

                        case 21:
                            x++;
                            _context4.next = 13;
                            break;

                        case 24:
                            _context4.next = 26;
                            return _bricole2.default.count(query);

                        case 26:
                            count = _context4.sent;
                            return _context4.abrupt('return', res.send(new _ApiResponse2.default(result, page, Math.ceil(count / limit), limit, count, req)));

                        case 30:
                            _context4.prev = 30;
                            _context4.t0 = _context4['catch'](0);

                            next(_context4.t0);

                        case 33:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, _this4, [[0, 30]]);
        }))();
    },


    //retrive all bricols under one bricoler 
    fetchAllBricolOfOneBricoler: function fetchAllBricolOfOneBricoler(req, res, next) {
        var _this5 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
            var limit, page, bricolerId, query, allBricols, result, x, _query2, countBids, count;

            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _context5.prev = 0;

                            console.log('s');
                            limit = parseInt(req.query.limit) || 20;
                            page = req.query.page || 1;
                            bricolerId = req.params.bricolerId;
                            query = {};

                            if (req.query.status) query.status = req.query.status;
                            query.bricoler = bricolerId;
                            _context5.next = 10;
                            return _bricole2.default.find(query).populate('user').populate('job').populate('bricoler').skip((page - 1) * limit).limit(limit).sort({ creationDate: -1 });

                        case 10:
                            allBricols = _context5.sent;
                            result = [];
                            x = 0;

                        case 13:
                            if (!(x < allBricols.length)) {
                                _context5.next = 24;
                                break;
                            }

                            _query2 = {};

                            _query2.bricol = allBricols[x].id;
                            _query2.bidType = 'inCity';
                            _context5.next = 19;
                            return _bid2.default.count(_query2);

                        case 19:
                            countBids = _context5.sent;

                            result.push({ bricol: allBricols[x], countBids: countBids });

                        case 21:
                            x++;
                            _context5.next = 13;
                            break;

                        case 24:
                            _context5.next = 26;
                            return _bricole2.default.count(query);

                        case 26:
                            count = _context5.sent;
                            return _context5.abrupt('return', res.send(new _ApiResponse2.default(result, page, Math.ceil(count / limit), limit, count, req)));

                        case 30:
                            _context5.prev = 30;
                            _context5.t0 = _context5['catch'](0);

                            next(_context5.t0);

                        case 33:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, _this5, [[0, 30]]);
        }))();
    }
};
//# sourceMappingURL=user.controller.js.map