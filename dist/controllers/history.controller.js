'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _history = require('../models/history.model');

var _history2 = _interopRequireDefault(_history);

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _ApiResponse = require('../helpers/ApiResponse');

var _ApiResponse2 = _interopRequireDefault(_ApiResponse);

var _ApiError = require('../helpers/ApiError');

var _ApiError2 = _interopRequireDefault(_ApiError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
    //retrive all bricoler (provider) history 
    retriveHistoryOfBricoler: function retriveHistoryOfBricoler(req, res, next) {
        var _this = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var limit, page, bricolerId, userDetails, query, allDoc, count;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            limit = parseInt(req.query.limit) || 20;
                            page = req.query.page || 1;
                            bricolerId = req.params.bricolerId;
                            _context.next = 6;
                            return _user2.default.findById(bricolerId);

                        case 6:
                            userDetails = _context.sent;

                            if (userDetails) {
                                _context.next = 9;
                                break;
                            }

                            return _context.abrupt('return', res.status(404).end());

                        case 9:
                            query = {};

                            query.bricoler = bricolerId;
                            _context.next = 13;
                            return _history2.default.find(query).populate('service').populate('bricoler').populate('user').skip((page - 1) * limit).limit(limit).sort({ creationDate: -1 });

                        case 13:
                            allDoc = _context.sent;
                            _context.next = 16;
                            return _history2.default.count(query);

                        case 16:
                            count = _context.sent;
                            return _context.abrupt('return', res.send(new _ApiResponse2.default(allDoc, page, Math.ceil(count / limit), limit, count, req)));

                        case 20:
                            _context.prev = 20;
                            _context.t0 = _context['catch'](0);

                            next(_context.t0);

                        case 23:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[0, 20]]);
        }))();
    },


    //retrive all user (client) history 
    retriveHistoryOfUser: function retriveHistoryOfUser(req, res, next) {
        var _this2 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var limit, page, userId, userDetails, query, allDoc, count;
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
                            query = {};

                            query.user = userId;
                            _context2.next = 13;
                            return _history2.default.find(query).populate('service').populate('bricoler').populate('user').skip((page - 1) * limit).limit(limit).sort({ creationDate: -1 });

                        case 13:
                            allDoc = _context2.sent;
                            _context2.next = 16;
                            return _history2.default.count(query);

                        case 16:
                            count = _context2.sent;
                            return _context2.abrupt('return', res.send(new _ApiResponse2.default(allDoc, page, Math.ceil(count / limit), limit, count, req)));

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
    }
};
//# sourceMappingURL=history.controller.js.map