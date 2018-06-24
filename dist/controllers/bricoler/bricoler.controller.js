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

var _check = require('express-validator/check');

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
    //retrive all user that have complete profile 
    fetchAllBricoler: function fetchAllBricoler(req, res, next) {
        var _this = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var limit, page, _req$query, jobs, gender, query, matchQueryRegx, allDocs, count;

            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            limit = parseInt(req.query.limit) || 200;
                            page = req.query.page || 1;
                            _req$query = req.query, jobs = _req$query.jobs, gender = _req$query.gender;
                            query = {};
                            //filter by gender

                            if (gender) query.gender = gender;
                            //search by word in about of bricoler (user)
                            if (req.query.q) {
                                matchQueryRegx = new RegExp((0, _lodash.escapeRegExp)(req.query.q), 'i');

                                query.about = matchQueryRegx;
                            }
                            query.completed = true;

                            _context.next = 10;
                            return _user2.default.find(query).populate('city').populate('jobs').skip((page - 1) * limit).limit(limit).sort({ creationDate: -1 });

                        case 10:
                            allDocs = _context.sent;
                            _context.next = 13;
                            return _user2.default.count(query);

                        case 13:
                            count = _context.sent;
                            return _context.abrupt('return', res.send(new _ApiResponse2.default(allDocs, page, Math.ceil(count / limit), limit, count, req)));

                        case 17:
                            _context.prev = 17;
                            _context.t0 = _context['catch'](0);

                            next(_context.t0);

                        case 20:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[0, 17]]);
        }))();
    }
};
//# sourceMappingURL=bricoler.controller.js.map