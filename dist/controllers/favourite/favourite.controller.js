'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _user = require('../../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _ApiResponse = require('../../helpers/ApiResponse');

var _ApiResponse2 = _interopRequireDefault(_ApiResponse);

var _ApiError = require('../../helpers/ApiError');

var _ApiError2 = _interopRequireDefault(_ApiError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
    //add one bricoler to user favourite list
    addFavouriteToMyList: function addFavouriteToMyList(req, res, next) {
        var _this = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var bricolerDetails, userId, userDetails, bricolerIds, bricolerId, newUser;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;

                            if (req.body.bricolerId) {
                                _context.next = 3;
                                break;
                            }

                            return _context.abrupt('return', next(new _ApiError2.default(422, 'bricoler Id is required')));

                        case 3:
                            _context.next = 5;
                            return _user2.default.findById(req.body.bricolerId);

                        case 5:
                            bricolerDetails = _context.sent;

                            if (bricolerDetails) {
                                _context.next = 8;
                                break;
                            }

                            return _context.abrupt('return', res.status(404).end());

                        case 8:
                            userId = req.params.userId;
                            _context.next = 11;
                            return _user2.default.findById(userId);

                        case 11:
                            userDetails = _context.sent;

                            if (userDetails) {
                                _context.next = 14;
                                break;
                            }

                            return _context.abrupt('return', res.status(404).end());

                        case 14:
                            bricolerIds = userDetails.favouritArray;
                            bricolerId = req.body.bricolerId;

                            //check if this bricoler in my list or not 

                            if (!bricolerIds.includes(bricolerId)) {
                                _context.next = 18;
                                break;
                            }

                            return _context.abrupt('return', next(new _ApiError2.default(422, 'You have added this bricoler in your favourite list before')));

                        case 18:

                            //if not found 
                            userDetails.favouritArray.push(bricolerId);
                            _context.next = 21;
                            return userDetails.save();

                        case 21:
                            _context.next = 23;
                            return _user2.default.findById(userId);

                        case 23:
                            newUser = _context.sent;

                            console.log(newUser.favouritArray);
                            return _context.abrupt('return', res.status(204).end());

                        case 28:
                            _context.prev = 28;
                            _context.t0 = _context['catch'](0);

                            next(_context.t0);

                        case 31:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[0, 28]]);
        }))();
    },

    //retrive all favourite bricolers of one user 
    retriveAllFavouriteBricolersOfOneUser: function retriveAllFavouriteBricolersOfOneUser(req, res, next) {
        var _this2 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var limit, page, userId, userDetails, bricolerArray, arrayLength, result, x, userDoc, count;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;
                            limit = parseInt(req.query.limit) || 20;
                            page = req.query.page || 1;
                            userId = req.params.userId;
                            _context2.next = 6;
                            return _user2.default.findById(userId);

                        case 6:
                            userDetails = _context2.sent;

                            if (userDetails) {
                                _context2.next = 9;
                                break;
                            }

                            return _context2.abrupt('return', res.status(404).end());

                        case 9:
                            bricolerArray = userDetails.favouritArray;
                            arrayLength = bricolerArray.length;
                            result = [];
                            x = 0;

                        case 13:
                            if (!(x < arrayLength)) {
                                _context2.next = 21;
                                break;
                            }

                            _context2.next = 16;
                            return _user2.default.findById(bricolerArray[x]).populate('job').populate('city');

                        case 16:
                            userDoc = _context2.sent;

                            result.push(userDoc);

                        case 18:
                            x++;
                            _context2.next = 13;
                            break;

                        case 21:
                            count = arrayLength;
                            return _context2.abrupt('return', res.send(new _ApiResponse2.default(result, page, Math.ceil(count / limit), limit, count, req)));

                        case 25:
                            _context2.prev = 25;
                            _context2.t0 = _context2['catch'](0);

                            next(_context2.t0);

                        case 28:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2, [[0, 25]]);
        }))();
    }
};
//# sourceMappingURL=favourite.controller.js.map