'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _validateBody$signUp$;

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _bricole = require('../models/bricole.model');

var _bricole2 = _interopRequireDefault(_bricole);

var _bricolBtCities = require('../models/bricol-bt-cities.model');

var _bricolBtCities2 = _interopRequireDefault(_bricolBtCities);

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
exports.default = (_validateBody$signUp$ = {
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
            var limit, page, userId, userDetails, query, allBricols, result, x, _query, countBids, count;

            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.prev = 0;

                            console.log('s');
                            limit = parseInt(req.query.limit) || 20;
                            page = req.query.page || 1;
                            userId = req.params.userId;
                            _context4.next = 7;
                            return _user2.default.findById(userId);

                        case 7:
                            userDetails = _context4.sent;

                            if (userDetails) {
                                _context4.next = 10;
                                break;
                            }

                            return _context4.abrupt('return', res.status(404).end());

                        case 10:
                            query = {};

                            if (req.query.status) query.status = req.query.status;
                            query.user = userId;
                            _context4.next = 15;
                            return _bricole2.default.find(query).populate('user').populate('job').populate('bricoler').skip((page - 1) * limit).limit(limit).sort({ creationDate: -1 });

                        case 15:
                            allBricols = _context4.sent;
                            result = [];
                            x = 0;

                        case 18:
                            if (!(x < allBricols.length)) {
                                _context4.next = 29;
                                break;
                            }

                            _query = {};

                            _query.bricol = allBricols[x].id;
                            _query.bidType = 'inCity';
                            _context4.next = 24;
                            return _bid2.default.count(_query);

                        case 24:
                            countBids = _context4.sent;

                            result.push({ bricol: allBricols[x], countBids: countBids });

                        case 26:
                            x++;
                            _context4.next = 18;
                            break;

                        case 29:
                            _context4.next = 31;
                            return _bricole2.default.count(query);

                        case 31:
                            count = _context4.sent;
                            return _context4.abrupt('return', res.send(new _ApiResponse2.default(result, page, Math.ceil(count / limit), limit, count, req)));

                        case 35:
                            _context4.prev = 35;
                            _context4.t0 = _context4['catch'](0);

                            next(_context4.t0);

                        case 38:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, _this4, [[0, 35]]);
        }))();
    },


    //retrive all bricols under one bricoler 
    fetchAllBricolOfOneBricoler: function fetchAllBricolOfOneBricoler(req, res, next) {
        var _this5 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
            var limit, page, bricolerId, userDetails, query, allBricols, result, x, _query2, countBids, count;

            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _context5.prev = 0;

                            console.log('s');
                            limit = parseInt(req.query.limit) || 20;
                            page = req.query.page || 1;
                            bricolerId = req.params.bricolerId;
                            _context5.next = 7;
                            return _user2.default.findById(bricolerId);

                        case 7:
                            userDetails = _context5.sent;

                            if (userDetails) {
                                _context5.next = 10;
                                break;
                            }

                            return _context5.abrupt('return', res.status(404).end());

                        case 10:
                            query = {};

                            if (req.query.status) query.status = req.query.status;
                            query.bricoler = bricolerId;
                            _context5.next = 15;
                            return _bricole2.default.find(query).populate('user').populate('job').populate('bricoler').skip((page - 1) * limit).limit(limit).sort({ creationDate: -1 });

                        case 15:
                            allBricols = _context5.sent;
                            result = [];
                            x = 0;

                        case 18:
                            if (!(x < allBricols.length)) {
                                _context5.next = 29;
                                break;
                            }

                            _query2 = {};

                            _query2.bricol = allBricols[x].id;
                            _query2.bidType = 'inCity';
                            _context5.next = 24;
                            return _bid2.default.count(_query2);

                        case 24:
                            countBids = _context5.sent;

                            result.push({ bricol: allBricols[x], countBids: countBids });

                        case 26:
                            x++;
                            _context5.next = 18;
                            break;

                        case 29:
                            _context5.next = 31;
                            return _bricole2.default.count(query);

                        case 31:
                            count = _context5.sent;
                            return _context5.abrupt('return', res.send(new _ApiResponse2.default(result, page, Math.ceil(count / limit), limit, count, req)));

                        case 35:
                            _context5.prev = 35;
                            _context5.t0 = _context5['catch'](0);

                            next(_context5.t0);

                        case 38:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, _this5, [[0, 35]]);
        }))();
    },


    //retrive all bricoles between city under one user 
    retriveAllBricolsBtCityOfUser: function retriveAllBricolsBtCityOfUser(req, res, next) {
        var _this6 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
            var userId, userDetails, limit, page, query, allDocs, result, x, bidQuery, countOfBids, count;
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            _context6.prev = 0;
                            userId = req.params.userId;
                            _context6.next = 4;
                            return _user2.default.findById(userId);

                        case 4:
                            userDetails = _context6.sent;

                            if (userDetails) {
                                _context6.next = 7;
                                break;
                            }

                            return _context6.abrupt('return', res.status(404).end());

                        case 7:
                            limit = parseInt(req.query.limit) || 20;
                            page = req.query.page || 1;
                            query = {};

                            query.user = userId;
                            if (req.query.status) query.status = req.query.status;
                            _context6.next = 14;
                            return _bricolBtCities2.default.find(query).populate('user').populate('job').populate('bricoler').skip((page - 1) * limit).limit(limit).sort({ creationDate: -1 });

                        case 14:
                            allDocs = _context6.sent;


                            //prepare response 
                            result = [];
                            x = 0;

                        case 17:
                            if (!(x < allDocs.length)) {
                                _context6.next = 26;
                                break;
                            }

                            //get count of bids for each bricol
                            bidQuery = {
                                bricol: allDocs[x].id,
                                bidType: 'bricol-bt-cities'
                            };
                            _context6.next = 21;
                            return _bid2.default.count(bidQuery);

                        case 21:
                            countOfBids = _context6.sent;

                            result.push({ bricol: allDocs[x], countOfBids: countOfBids });

                        case 23:
                            x++;
                            _context6.next = 17;
                            break;

                        case 26:
                            _context6.next = 28;
                            return _bricolBtCities2.default.count(query);

                        case 28:
                            count = _context6.sent;
                            return _context6.abrupt('return', res.send(new _ApiResponse2.default(result, page, Math.ceil(count / limit), limit, count, req)));

                        case 32:
                            _context6.prev = 32;
                            _context6.t0 = _context6['catch'](0);

                            next(_context6.t0);

                        case 35:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, _callee6, _this6, [[0, 32]]);
        }))();
    },


    //retrive all bricols between city under one bricoler 
    retriveAllBricolsBtCityOfBricoler: function retriveAllBricolsBtCityOfBricoler(req, res, next) {
        var _this7 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
            var bricolerId, userDetails, limit, page, query, allDocs, count;
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            _context7.prev = 0;
                            bricolerId = req.params.bricolerId;
                            //check if bricoler exist 

                            _context7.next = 4;
                            return _user2.default.findById(bricolerId);

                        case 4:
                            userDetails = _context7.sent;

                            if (userDetails) {
                                _context7.next = 7;
                                break;
                            }

                            return _context7.abrupt('return', res.status(404).end());

                        case 7:
                            limit = parseInt(req.query.limit) || 20;
                            page = req.query.page || 1;
                            query = {};

                            query.bricoler = bricolerId;
                            if (req.query.status) query.status = req.query.status;

                            _context7.next = 14;
                            return _bricolBtCities2.default.find(query).populate('user').populate('job').populate('bricoler').skip((page - 1) * limit).limit(limit).sort({ creationDate: -1 });

                        case 14:
                            allDocs = _context7.sent;
                            _context7.next = 17;
                            return _bricolBtCities2.default.count(query);

                        case 17:
                            count = _context7.sent;
                            return _context7.abrupt('return', res.send(new _ApiResponse2.default(allDocs, page, Math.ceil(count / limit), limit, count, req)));

                        case 21:
                            _context7.prev = 21;
                            _context7.t0 = _context7['catch'](0);

                            next(_context7.t0);

                        case 24:
                        case 'end':
                            return _context7.stop();
                    }
                }
            }, _callee7, _this7, [[0, 21]]);
        }))();
    },


    //count #bricols under one User 
    countNumberOfBricolsOfUser: function countNumberOfBricolsOfUser(req, res, next) {
        var _this8 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
            var userId, userDetails, query, allBricols, penddingBricols, assignedBricols, inProgressBricols, doneBricols, result, btQuery, allBtBricols, penddingBtBricols, assignedBtBricols, inProgressBtBricols, doneBtBricols;
            return regeneratorRuntime.wrap(function _callee8$(_context8) {
                while (1) {
                    switch (_context8.prev = _context8.next) {
                        case 0:
                            _context8.prev = 0;
                            userId = req.params.userId;
                            _context8.next = 4;
                            return _user2.default.findById(userId);

                        case 4:
                            userDetails = _context8.sent;

                            if (userDetails) {
                                _context8.next = 7;
                                break;
                            }

                            return _context8.abrupt('return', res.status(404).end());

                        case 7:

                            //incity Bricols 
                            query = {};

                            query.user = userId;
                            _context8.next = 11;
                            return _bricole2.default.count(query);

                        case 11:
                            allBricols = _context8.sent;

                            query.status = 'pendding';
                            _context8.next = 15;
                            return _bricole2.default.count(query);

                        case 15:
                            penddingBricols = _context8.sent;

                            query.status = 'assigned';
                            _context8.next = 19;
                            return _bricole2.default.count(query);

                        case 19:
                            assignedBricols = _context8.sent;

                            query.status = 'inProgress';
                            _context8.next = 23;
                            return _bricole2.default.count(query);

                        case 23:
                            inProgressBricols = _context8.sent;

                            query.status = 'done';
                            _context8.next = 27;
                            return _bricole2.default.count(query);

                        case 27:
                            doneBricols = _context8.sent;
                            result = {};

                            result.incityBricols = {
                                allBricols: allBricols,
                                penddingBricols: penddingBricols,
                                assignedBricols: assignedBricols,
                                inProgressBricols: inProgressBricols,
                                doneBricols: doneBricols

                                //between city bricols 
                            };btQuery = {};

                            btQuery.user = userId;
                            _context8.next = 34;
                            return _bricolBtCities2.default.count(btQuery);

                        case 34:
                            allBtBricols = _context8.sent;

                            btQuery.status = 'pendding';
                            _context8.next = 38;
                            return _bricolBtCities2.default.count(btQuery);

                        case 38:
                            penddingBtBricols = _context8.sent;

                            btQuery.status = 'assigned';
                            _context8.next = 42;
                            return _bricolBtCities2.default.count(btQuery);

                        case 42:
                            assignedBtBricols = _context8.sent;

                            btQuery.status = 'inProgress';
                            _context8.next = 46;
                            return _bricolBtCities2.default.count(btQuery);

                        case 46:
                            inProgressBtBricols = _context8.sent;

                            btQuery.status = 'done';
                            _context8.next = 50;
                            return _bricolBtCities2.default.count(btQuery);

                        case 50:
                            doneBtBricols = _context8.sent;

                            result.betweenCityBricols = {
                                allBtBricols: allBtBricols,
                                penddingBtBricols: penddingBtBricols,
                                assignedBtBricols: assignedBtBricols,
                                inProgressBtBricols: inProgressBtBricols,
                                doneBtBricols: doneBtBricols
                            };
                            return _context8.abrupt('return', res.status(200).json(result));

                        case 55:
                            _context8.prev = 55;
                            _context8.t0 = _context8['catch'](0);

                            next(_context8.t0);

                        case 58:
                        case 'end':
                            return _context8.stop();
                    }
                }
            }, _callee8, _this8, [[0, 55]]);
        }))();
    }
}, _defineProperty(_validateBody$signUp$, 'countNumberOfBricolsOfUser', function countNumberOfBricolsOfUser(req, res, next) {
    var _this9 = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
        var userId, userDetails, query, allBricols, penddingBricols, assignedBricols, inProgressBricols, doneBricols, result, btQuery, allBtBricols, penddingBtBricols, assignedBtBricols, inProgressBtBricols, doneBtBricols;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        _context9.prev = 0;
                        userId = req.params.userId;
                        _context9.next = 4;
                        return _user2.default.findById(userId);

                    case 4:
                        userDetails = _context9.sent;

                        if (userDetails) {
                            _context9.next = 7;
                            break;
                        }

                        return _context9.abrupt('return', res.status(404).end());

                    case 7:

                        //incity Bricols 
                        query = {};

                        query.user = userId;
                        _context9.next = 11;
                        return _bricole2.default.count(query);

                    case 11:
                        allBricols = _context9.sent;

                        query.status = 'pendding';
                        _context9.next = 15;
                        return _bricole2.default.count(query);

                    case 15:
                        penddingBricols = _context9.sent;

                        query.status = 'assigned';
                        _context9.next = 19;
                        return _bricole2.default.count(query);

                    case 19:
                        assignedBricols = _context9.sent;

                        query.status = 'inProgress';
                        _context9.next = 23;
                        return _bricole2.default.count(query);

                    case 23:
                        inProgressBricols = _context9.sent;

                        query.status = 'done';
                        _context9.next = 27;
                        return _bricole2.default.count(query);

                    case 27:
                        doneBricols = _context9.sent;
                        result = {};

                        result.incityBricols = {
                            allBricols: allBricols,
                            penddingBricols: penddingBricols,
                            assignedBricols: assignedBricols,
                            inProgressBricols: inProgressBricols,
                            doneBricols: doneBricols

                            //between city bricols 
                        };btQuery = {};

                        btQuery.user = userId;
                        _context9.next = 34;
                        return _bricolBtCities2.default.count(btQuery);

                    case 34:
                        allBtBricols = _context9.sent;

                        btQuery.status = 'pendding';
                        _context9.next = 38;
                        return _bricolBtCities2.default.count(btQuery);

                    case 38:
                        penddingBtBricols = _context9.sent;

                        btQuery.status = 'assigned';
                        _context9.next = 42;
                        return _bricolBtCities2.default.count(btQuery);

                    case 42:
                        assignedBtBricols = _context9.sent;

                        btQuery.status = 'inProgress';
                        _context9.next = 46;
                        return _bricolBtCities2.default.count(btQuery);

                    case 46:
                        inProgressBtBricols = _context9.sent;

                        btQuery.status = 'done';
                        _context9.next = 50;
                        return _bricolBtCities2.default.count(btQuery);

                    case 50:
                        doneBtBricols = _context9.sent;

                        result.betweenCityBricols = {
                            allBtBricols: allBtBricols,
                            penddingBtBricols: penddingBtBricols,
                            assignedBtBricols: assignedBtBricols,
                            inProgressBtBricols: inProgressBtBricols,
                            doneBtBricols: doneBtBricols
                        };
                        return _context9.abrupt('return', res.status(200).json(result));

                    case 55:
                        _context9.prev = 55;
                        _context9.t0 = _context9['catch'](0);

                        next(_context9.t0);

                    case 58:
                    case 'end':
                        return _context9.stop();
                }
            }
        }, _callee9, _this9, [[0, 55]]);
    }))();
}), _defineProperty(_validateBody$signUp$, 'countNumberOfBricolsOfBricoler', function countNumberOfBricolsOfBricoler(req, res, next) {
    var _this10 = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
        var bricolerId, userDetails, query, allBricols, penddingBricols, assignedBricols, inProgressBricols, doneBricols, result, btQuery, allBtBricols, penddingBtBricols, assignedBtBricols, inProgressBtBricols, doneBtBricols;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) {
                switch (_context10.prev = _context10.next) {
                    case 0:
                        _context10.prev = 0;
                        bricolerId = req.params.bricolerId;
                        _context10.next = 4;
                        return _user2.default.findById(bricolerId);

                    case 4:
                        userDetails = _context10.sent;

                        if (userDetails) {
                            _context10.next = 7;
                            break;
                        }

                        return _context10.abrupt('return', res.status(404).end());

                    case 7:

                        //incity Bricols 
                        query = {};

                        query.bricoler = bricolerId;
                        _context10.next = 11;
                        return _bricole2.default.count(query);

                    case 11:
                        allBricols = _context10.sent;

                        query.status = 'pendding';
                        _context10.next = 15;
                        return _bricole2.default.count(query);

                    case 15:
                        penddingBricols = _context10.sent;

                        query.status = 'assigned';
                        _context10.next = 19;
                        return _bricole2.default.count(query);

                    case 19:
                        assignedBricols = _context10.sent;

                        query.status = 'inProgress';
                        _context10.next = 23;
                        return _bricole2.default.count(query);

                    case 23:
                        inProgressBricols = _context10.sent;

                        query.status = 'done';
                        _context10.next = 27;
                        return _bricole2.default.count(query);

                    case 27:
                        doneBricols = _context10.sent;
                        result = {};

                        result.incityBricols = {
                            allBricols: allBricols,
                            assignedBricols: assignedBricols,
                            inProgressBricols: inProgressBricols,
                            doneBricols: doneBricols

                            //between city bricols 
                        };btQuery = {};

                        btQuery.bricoler = bricolerId;
                        _context10.next = 34;
                        return _bricolBtCities2.default.count(btQuery);

                    case 34:
                        allBtBricols = _context10.sent;

                        btQuery.status = 'pendding';
                        _context10.next = 38;
                        return _bricolBtCities2.default.count(btQuery);

                    case 38:
                        penddingBtBricols = _context10.sent;

                        btQuery.status = 'assigned';
                        _context10.next = 42;
                        return _bricolBtCities2.default.count(btQuery);

                    case 42:
                        assignedBtBricols = _context10.sent;

                        btQuery.status = 'inProgress';
                        _context10.next = 46;
                        return _bricolBtCities2.default.count(btQuery);

                    case 46:
                        inProgressBtBricols = _context10.sent;

                        btQuery.status = 'done';
                        _context10.next = 50;
                        return _bricolBtCities2.default.count(btQuery);

                    case 50:
                        doneBtBricols = _context10.sent;

                        result.betweenCityBricols = {
                            allBtBricols: allBtBricols,
                            assignedBtBricols: assignedBtBricols,
                            inProgressBtBricols: inProgressBtBricols,
                            doneBtBricols: doneBtBricols
                        };
                        return _context10.abrupt('return', res.status(200).json(result));

                    case 55:
                        _context10.prev = 55;
                        _context10.t0 = _context10['catch'](0);

                        next(_context10.t0);

                    case 58:
                    case 'end':
                        return _context10.stop();
                }
            }
        }, _callee10, _this10, [[0, 55]]);
    }))();
}), _defineProperty(_validateBody$signUp$, 'retriveUserDetails', function retriveUserDetails(req, res, next) {
    var _this11 = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
        var userId, userDetails;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
            while (1) {
                switch (_context11.prev = _context11.next) {
                    case 0:
                        _context11.prev = 0;
                        userId = req.params.userId;
                        _context11.next = 4;
                        return _user2.default.findById(userId).populate('jobs').populate('city');

                    case 4:
                        userDetails = _context11.sent;

                        if (userDetails) {
                            _context11.next = 7;
                            break;
                        }

                        return _context11.abrupt('return', res.status(404).end());

                    case 7:
                        return _context11.abrupt('return', res.status(200).json(userDetails));

                    case 10:
                        _context11.prev = 10;
                        _context11.t0 = _context11['catch'](0);

                        next(_context11.t0);

                    case 13:
                    case 'end':
                        return _context11.stop();
                }
            }
        }, _callee11, _this11, [[0, 10]]);
    }))();
}), _validateBody$signUp$);
//# sourceMappingURL=user.controller.js.map