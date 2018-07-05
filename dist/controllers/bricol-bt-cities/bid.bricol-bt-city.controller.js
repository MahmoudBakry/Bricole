'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bid = require('../../models/bid.model');

var _bid2 = _interopRequireDefault(_bid);

var _bricolBtCities = require('../../models/bricol-bt-cities.model');

var _bricolBtCities2 = _interopRequireDefault(_bricolBtCities);

var _user = require('../../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _history = require('../../models/history.model');

var _history2 = _interopRequireDefault(_history);

var _notification = require('../../models/notification.model');

var _notification2 = _interopRequireDefault(_notification);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _ApiResponse = require('../../helpers/ApiResponse');

var _ApiResponse2 = _interopRequireDefault(_ApiResponse);

var _ApiError = require('../../helpers/ApiError');

var _ApiError2 = _interopRequireDefault(_ApiError);

var _check = require('express-validator/check');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
    //validation for create new bid
    validateBody: function validateBody() {
        var validations = [(0, _check.body)("cost").exists().withMessage("cost is required"), (0, _check.body)("user").exists().withMessage("user is required"), (0, _check.body)('offerDescription').exists().withMessage("offerDescription  is required"), (0, _check.body)("cost").exists().withMessage("cost is required")];
        return validations;
    },


    //create new Bid for specific bricol 
    createNewBid: function createNewBid(req, res, next) {
        var _this = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var validationErrors, bricolDetails, query, bidExist, bricolId, newBid, newNoti, title, _body;

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
                            _context.next = 6;
                            return Bricol.findById(req.params.bricolId);

                        case 6:
                            bricolDetails = _context.sent;

                            if (bricolDetails) {
                                _context.next = 9;
                                break;
                            }

                            return _context.abrupt('return', res.status(404).end());

                        case 9:
                            query = {
                                user: req.body.user,
                                bricol: req.params.bricolId,
                                bidType: 'bricol-bt-cities'
                            };
                            _context.next = 12;
                            return _bid2.default.findOne(query);

                        case 12:
                            bidExist = _context.sent;

                            if (!bidExist) {
                                _context.next = 16;
                                break;
                            }

                            console.log(bidExist);
                            return _context.abrupt('return', next(new _ApiError2.default(400, 'لا يمكنك إضافة عرضين لنفس الخدمة')));

                        case 16:
                            bricolId = req.params.bricolId;

                            req.body.bricol = bricolId;
                            req.body.bidType = 'bricol-bt-cities';
                            _context.next = 21;
                            return _bid2.default.create(req.body);

                        case 21:
                            newBid = _context.sent;
                            _context.next = 24;
                            return _notification2.default.create({
                                targetUser: bricolDetails.user,
                                subjectType: 'bricol-bt-cities',
                                subject: req.params.bricolId,
                                text: 'لديك عرض جديد على خدمتك'
                            });

                        case 24:
                            newNoti = _context.sent;


                            //send notifications
                            title = "لديك عرض جديد على خدمتك";
                            _body = "أضاف أحد مزودي الخدمات عرضًا جديدًا لخدمتك ،خذ جولة واقرأ هذا العرض";

                            send(bricolDetails.user, title, _body);

                            return _context.abrupt('return', res.status(201).json(newBid));

                        case 31:
                            _context.prev = 31;
                            _context.t0 = _context['catch'](0);

                            next(_context.t0);

                        case 34:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[0, 31]]);
        }))();
    },


    //retrive all bids under one bricole 
    retriveAllBidsOfOneBricole: function retriveAllBidsOfOneBricole(req, res, next) {
        var _this2 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var limit, page, bricolId, query, allDocs, count;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;
                            limit = parseInt(req.query.limit) || 20;
                            page = req.query.page || 1;
                            bricolId = req.params.bricolId;
                            query = {};

                            query.bricol = bricolId;
                            query.bidType = 'bricol-bt-cities';

                            _context2.next = 9;
                            return _bid2.default.find(query).populate('user').populate('bricol').skip((page - 1) * limit).limit(limit).sort({ creationDate: -1 });

                        case 9:
                            allDocs = _context2.sent;
                            _context2.next = 12;
                            return _bid2.default.count(query);

                        case 12:
                            count = _context2.sent;
                            return _context2.abrupt('return', res.send(new _ApiResponse2.default(allDocs, page, Math.ceil(count / limit), limit, count, req)));

                        case 16:
                            _context2.prev = 16;
                            _context2.t0 = _context2['catch'](0);

                            next(_context2.t0);

                        case 19:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2, [[0, 16]]);
        }))();
    },


    //acceppt bid 
    accepptBid: function accepptBid(req, res, next) {
        var _this3 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            var bidId, bricolId, bidDetails, bricolDetails, userId, historyQuery, historyDoc, newNoti, title, body;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            bidId = req.params.bidId;
                            bricolId = req.params.bricolId;
                            _context3.next = 4;
                            return _bid2.default.findById(bidId);

                        case 4:
                            bidDetails = _context3.sent;

                            if (bidDetails) {
                                _context3.next = 7;
                                break;
                            }

                            return _context3.abrupt('return', next(new _ApiError2.default(404)));

                        case 7:
                            _context3.next = 9;
                            return _bricolBtCities2.default.findById(bricolId);

                        case 9:
                            bricolDetails = _context3.sent;

                            if (bricolDetails) {
                                _context3.next = 12;
                                break;
                            }

                            return _context3.abrupt('return', next(new _ApiError2.default(404)));

                        case 12:
                            userId = req.user._id;

                            if (userId == bricolDetails.user) {
                                _context3.next = 15;
                                break;
                            }

                            return _context3.abrupt('return', next(new _ApiError2.default(403, 'not access to this resource')));

                        case 15:
                            //update bricol details 
                            bricolDetails.status = "assigned";
                            bricolDetails.bricoler = bidDetails.user;
                            _context3.next = 19;
                            return bricolDetails.save();

                        case 19:
                            console.log(bricolDetails.bricoler);
                            //update bid 
                            bidDetails.status = 'accepted';
                            _context3.next = 23;
                            return bidDetails.save();

                        case 23:

                            //update bricole history 
                            historyQuery = {
                                serviceType: 'bricol-bt-cities',
                                service: bricolDetails.id,
                                user: bricolDetails.user
                            };
                            _context3.next = 26;
                            return _history2.default.findOne(historyQuery);

                        case 26:
                            historyDoc = _context3.sent;

                            console.log(historyDoc);
                            historyDoc.status = "assigned";
                            historyDoc.bricoler = bidDetails.user;
                            _context3.next = 32;
                            return historyDoc.save();

                        case 32:
                            _context3.t0 = console;
                            _context3.next = 35;
                            return _history2.default.findOne(historyQuery);

                        case 35:
                            _context3.t1 = _context3.sent;

                            _context3.t0.log.call(_context3.t0, _context3.t1);

                            _context3.next = 39;
                            return _notification2.default.create({
                                targetUser: bidDetails.user,
                                subjectType: 'bid',
                                subject: bidDetails.id,
                                text: 'تم قبول عرضك من مالك الخدمة'
                            });

                        case 39:
                            newNoti = _context3.sent;


                            //send notifications
                            title = "تم قبول عرضك";
                            body = "تم قبول عرضك من مالك الخدمة،اعمل بجد لكسب الثقة من الجميع";

                            send(bidDetails.user, title, body);

                            //return result
                            return _context3.abrupt('return', res.status(204).end());

                        case 44:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, _this3);
        }))();
    },


    //make bricole in progress  
    makeBricolInProgress: function makeBricolInProgress(req, res, next) {
        var _this4 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
            var bidId, bricolId, bidDetails, bricolDetails, userId, historyQuery, historyDoc;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            bidId = req.params.bidId;
                            bricolId = req.params.bricolId;
                            _context4.next = 4;
                            return _bid2.default.findById(bidId);

                        case 4:
                            bidDetails = _context4.sent;

                            if (bidDetails) {
                                _context4.next = 7;
                                break;
                            }

                            return _context4.abrupt('return', next(new _ApiError2.default(404)));

                        case 7:
                            _context4.next = 9;
                            return _bricolBtCities2.default.findById(bricolId);

                        case 9:
                            bricolDetails = _context4.sent;

                            if (bricolDetails) {
                                _context4.next = 12;
                                break;
                            }

                            return _context4.abrupt('return', next(new _ApiError2.default(404)));

                        case 12:
                            userId = req.user._id;

                            if (userId == bricolDetails.user) {
                                _context4.next = 15;
                                break;
                            }

                            return _context4.abrupt('return', next(new _ApiError2.default(403, 'not access to this resource')));

                        case 15:

                            //update bricol details 
                            bricolDetails.status = "inProgress";
                            _context4.next = 18;
                            return bricolDetails.save();

                        case 18:
                            console.log(bricolDetails.bricoler);

                            //update bricole history 
                            historyQuery = {
                                serviceType: 'bricol-bt-cities',
                                service: bricolDetails.id,
                                user: bricolDetails.user
                            };
                            _context4.next = 22;
                            return _history2.default.findOne(historyQuery);

                        case 22:
                            historyDoc = _context4.sent;

                            console.log(historyDoc);
                            historyDoc.status = "inProgress";
                            historyDoc.bricoler = bidDetails.user;
                            _context4.next = 28;
                            return historyDoc.save();

                        case 28:
                            _context4.t0 = console;
                            _context4.next = 31;
                            return _history2.default.findOne(historyQuery);

                        case 31:
                            _context4.t1 = _context4.sent;

                            _context4.t0.log.call(_context4.t0, _context4.t1);

                            return _context4.abrupt('return', res.status(204).end());

                        case 34:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, _this4);
        }))();
    }
};
//# sourceMappingURL=bid.bricol-bt-city.controller.js.map