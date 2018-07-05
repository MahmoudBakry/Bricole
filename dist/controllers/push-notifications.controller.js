"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _user = require("../models/user.model");

var _user2 = _interopRequireDefault(_user);

var _lodash = require("lodash");

var _ = _interopRequireWildcard(_lodash);

var _ApiError = require("../helpers/ApiError");

var _ApiError2 = _interopRequireDefault(_ApiError);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
    subscribe: function subscribe(req, res, next) {
        var _this = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var user, token, newUser;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            user = req.user;
                            _context.next = 3;
                            return _user2.default.findById(user.id);

                        case 3:
                            user = _context.sent;
                            token = req.body.token;

                            if (token) {
                                _context.next = 7;
                                break;
                            }

                            return _context.abrupt("return", next(new _ApiError2.default(422, "token is required")));

                        case 7:

                            user.pushTokens.push(token);

                            _context.next = 10;
                            return user.save();

                        case 10:
                            _context.next = 12;
                            return _user2.default.findById(user.id);

                        case 12:
                            newUser = _context.sent;

                            console.log(newUser.pushTokens);
                            console.log(newUser.pushTokens.length);

                            res.status(204).end();

                        case 16:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, _this);
        }))();
    },
    update: function update(req, res, next) {
        var _this2 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var user, oldToken, newToken, tokens, result;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;
                            user = req.user;
                            _context2.next = 4;
                            return _user2.default.findById(user.id);

                        case 4:
                            user = _context2.sent;
                            oldToken = req.body.oldToken;
                            newToken = req.body.newToken;

                            if (oldToken) {
                                _context2.next = 9;
                                break;
                            }

                            return _context2.abrupt("return", next(new _ApiError2.default(422, "oldToken is required")));

                        case 9:
                            if (newToken) {
                                _context2.next = 11;
                                break;
                            }

                            return _context2.abrupt("return", next(new _ApiError2.default(422, "newToken is required")));

                        case 11:
                            if (user.pushTokens.includes(oldToken)) {
                                _context2.next = 13;
                                break;
                            }

                            return _context2.abrupt("return", next(new _ApiError2.default(422, "oldToken not exists in this user ")));

                        case 13:
                            tokens = _extends({}, _.without(user.pushTokens, oldToken), { newToken: newToken });

                            console.log("dsd-------------------------------------");
                            console.log(tokens['1']);
                            //to convert object attributes to array 
                            result = Object.values(tokens);


                            console.log(result);
                            user.pushTokens = result;
                            //   user.pushTokens = tokens;

                            _context2.next = 21;
                            return user.save();

                        case 21:

                            res.status(204).end();
                            _context2.next = 27;
                            break;

                        case 24:
                            _context2.prev = 24;
                            _context2.t0 = _context2["catch"](0);

                            next(_context2.t0);

                        case 27:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2, [[0, 24]]);
        }))();
    },
    unsubscribe: function unsubscribe(req, res, next) {
        var _this3 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            var user, token, tokens, newUser;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            user = req.user;
                            _context3.next = 3;
                            return _user2.default.findById(user.id);

                        case 3:
                            user = _context3.sent;
                            token = req.body.token;

                            if (token) {
                                _context3.next = 7;
                                break;
                            }

                            return _context3.abrupt("return", next(new _ApiError2.default(422, "token is required")));

                        case 7:
                            tokens = _.without(user.pushTokens, token);

                            user.pushTokens = tokens;

                            _context3.next = 11;
                            return user.save();

                        case 11:
                            _context3.next = 13;
                            return _user2.default.findById(user.id);

                        case 13:
                            newUser = _context3.sent;

                            console.log(newUser.pushTokens);
                            console.log(newUser.pushTokens.length);

                            res.status(204).end();

                        case 17:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, _this3);
        }))();
    }
};
//# sourceMappingURL=push-notifications.controller.js.map