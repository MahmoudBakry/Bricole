'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _user = require('../../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _specialRequest = require('../../models/special-request.model');

var _specialRequest2 = _interopRequireDefault(_specialRequest);

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

var deg2rad = function deg2rad(deg) {
    return deg * (Math.PI / 180);
};

exports.default = {
    //retrive all user that have complete profile 
    fetchAllBricoler: function fetchAllBricoler(req, res, next) {
        var _this = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var limit, page, _req$query, jobs, gender, query, matchQueryRegx, allDocs, userLocation, result, x, bricolerLocationToDistance, lang1, lat1, lang2, lat2, R, dLat, dLon, a, c, d, count;

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


                            //1 - calculate distance between user and bricoler
                            userLocation = req.user.location;
                            result = [];

                            for (x = 0; x < allDocs.length; x++) {
                                bricolerLocationToDistance = allDocs[x].location;

                                //first locattion point

                                lang1 = parseFloat(bricolerLocationToDistance[0]);
                                lat1 = parseFloat(bricolerLocationToDistance[1]);

                                console.log(lang1);

                                //scound location point
                                lang2 = parseFloat(userLocation[0]);
                                lat2 = parseFloat(userLocation[1]);
                                R = 6371; // Radius of the earth in km

                                dLat = deg2rad(lat2 - lat1); // deg2rad above

                                dLon = deg2rad(lang2 - lang1);
                                a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
                                c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                                d = R * c; // Distance in km
                                //console.log(d)

                                result.push({ bricol: allDocs[x], distanceInKm: d });
                            }

                            _context.next = 16;
                            return _user2.default.count(query);

                        case 16:
                            count = _context.sent;
                            return _context.abrupt('return', res.send(new _ApiResponse2.default(result, page, Math.ceil(count / limit), limit, count, req)));

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


    //fetch all requests for specific bricoler 
    fetchRequestOfOneBricoler: function fetchRequestOfOneBricoler(req, res, next) {
        var _this2 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var limit, page, bricolerId, bricolerDetails, query, allDocs, count;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;
                            limit = parseInt(req.query.limit) || 200;
                            page = req.query.page || 1;
                            bricolerId = req.params.bricolerId;
                            _context2.next = 6;
                            return _user2.default.findById(bricolerId);

                        case 6:
                            bricolerDetails = _context2.sent;

                            if (bricolerDetails) {
                                _context2.next = 9;
                                break;
                            }

                            return _context2.abrupt('return', res.status(404).end());

                        case 9:
                            query = {};

                            query.bricoler = bricolerId;
                            query.status = 'pennding';
                            _context2.next = 14;
                            return _specialRequest2.default.find(query).populate('user').populate('bricoler').skip((page - 1) * limit).limit(limit).sort({ creationDate: -1 });

                        case 14:
                            allDocs = _context2.sent;
                            _context2.next = 17;
                            return _specialRequest2.default.count(query);

                        case 17:
                            count = _context2.sent;
                            return _context2.abrupt('return', res.send(new _ApiResponse2.default(allDocs, page, Math.ceil(count / limit), limit, count, req)));

                        case 21:
                            _context2.prev = 21;
                            _context2.t0 = _context2['catch'](0);

                            next(_context2.t0);

                        case 24:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2, [[0, 21]]);
        }))();
    }
};
//# sourceMappingURL=bricoler.controller.js.map