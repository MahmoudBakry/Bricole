'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _bid = require('../models/bid.model');

var _bid2 = _interopRequireDefault(_bid);

var _bricole = require('../models/bricole.model');

var _bricole2 = _interopRequireDefault(_bricole);

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _history = require('../models/history.model');

var _history2 = _interopRequireDefault(_history);

var _notification = require('../models/notification.model');

var _notification2 = _interopRequireDefault(_notification);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _ApiResponse = require('../helpers/ApiResponse');

var _ApiResponse2 = _interopRequireDefault(_ApiResponse);

var _ApiError = require('../helpers/ApiError');

var _ApiError2 = _interopRequireDefault(_ApiError);

var _check = require('express-validator/check');

var _pushNotifications = require('../services/push-notifications');

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
            var validationErrors, bricolDetails, query, bidExist, newNoti, title, _body, bricolId, newBid;

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
                            return _bricole2.default.findById(req.params.bricolId);

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
                                bidType: 'bricol'
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
                            _context.next = 18;
                            return _notification2.default.create({
                                targetUser: bricolDetails.user,
                                subjectType: 'bricol',
                                subject: req.params.bricolId,
                                text: 'لديك عرض جديد على خدمتك'
                            });

                        case 18:
                            newNoti = _context.sent;


                            //send notifications
                            title = "لديك عرض جديد على خدمتك";
                            _body = "أضاف أحد مزودي الخدمات عرضًا جديدًا لخدمتك ،خذ جولة واقرأ هذا العرض";

                            (0, _pushNotifications.send)(bricolDetails.user, title, _body);

                            bricolId = req.params.bricolId;

                            req.body.bricol = bricolId;
                            req.body.bidType = 'bricol';
                            _context.next = 27;
                            return _bid2.default.create(req.body);

                        case 27:
                            newBid = _context.sent;
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


    //retrive all Bid for one Bricol 
    retriveAllBidsForBricol: function retriveAllBidsForBricol(req, res, next) {
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
                            query.bidType = 'bricol';
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


    //count number of bids to specific bricol
    countNumberOfBidToONeBricol: function countNumberOfBidToONeBricol(req, res, next) {
        var _this3 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            var bricolId, query, bricolDetails, count;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.prev = 0;
                            bricolId = req.params.bricolId;
                            query = {};

                            query.bricol = bricolId;
                            query.bidType = 'bricol';
                            _context3.next = 7;
                            return _bricole2.default.findById(bricolId);

                        case 7:
                            bricolDetails = _context3.sent;

                            if (bricolDetails) {
                                _context3.next = 10;
                                break;
                            }

                            return _context3.abrupt('return', res.status(404).end());

                        case 10:
                            _context3.next = 12;
                            return _bid2.default.count({ bricol: bricolId });

                        case 12:
                            count = _context3.sent;
                            return _context3.abrupt('return', res.status(200).json({ count: count }));

                        case 16:
                            _context3.prev = 16;
                            _context3.t0 = _context3['catch'](0);

                            next(_context3.t0);

                        case 19:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, _this3, [[0, 16]]);
        }))();
    },


    //retrive Bid Details 
    bidDetails: function bidDetails(req, res, next) {
        var _this4 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
            var bidId, bidDetails;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.prev = 0;
                            bidId = req.params.bidId;
                            _context4.next = 4;
                            return _bid2.default.findById(bidId).populate('user').populate('bricol');

                        case 4:
                            bidDetails = _context4.sent;

                            if (bidDetails) {
                                _context4.next = 7;
                                break;
                            }

                            return _context4.abrupt('return', next(new _ApiError2.default(404)));

                        case 7:
                            console.log(bidDetails);
                            return _context4.abrupt('return', res.status(200).json(bidDetails));

                        case 11:
                            _context4.prev = 11;
                            _context4.t0 = _context4['catch'](0);

                            next(_context4.t0);

                        case 14:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, _this4, [[0, 11]]);
        }))();
    },


    //acceppt bid 
    accepptBid: function accepptBid(req, res, next) {
        var _this5 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
            var bidId, bricolId, bidDetails, bricolDetails, userId, historyQuery, historyDoc, newNoti, title, body;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            console.log(req.user._id);
                            bidId = req.params.bidId;
                            bricolId = req.params.bricolId;
                            _context5.next = 5;
                            return _bid2.default.findById(bidId);

                        case 5:
                            bidDetails = _context5.sent;

                            if (bidDetails) {
                                _context5.next = 8;
                                break;
                            }

                            return _context5.abrupt('return', next(new _ApiError2.default(404)));

                        case 8:
                            _context5.next = 10;
                            return _bricole2.default.findById(bricolId);

                        case 10:
                            bricolDetails = _context5.sent;

                            if (bricolDetails) {
                                _context5.next = 13;
                                break;
                            }

                            return _context5.abrupt('return', next(new _ApiError2.default(404)));

                        case 13:
                            userId = req.user._id;

                            if (userId == bricolDetails.user) {
                                _context5.next = 16;
                                break;
                            }

                            return _context5.abrupt('return', next(new _ApiError2.default(403, 'not access to this resource')));

                        case 16:
                            //  update bricol details 
                            bricolDetails.status = "assigned";
                            bricolDetails.bricoler = bidDetails.user;
                            _context5.next = 20;
                            return bricolDetails.save();

                        case 20:
                            console.log(bricolDetails.bricoler);
                            //update bid 
                            bidDetails.status = 'accepted';
                            _context5.next = 24;
                            return bidDetails.save();

                        case 24:

                            //update bricole history 
                            historyQuery = {
                                serviceType: 'bricol',
                                service: bricolDetails.id,
                                user: bricolDetails.user
                            };
                            _context5.next = 27;
                            return _history2.default.findOne(historyQuery);

                        case 27:
                            historyDoc = _context5.sent;

                            console.log(historyDoc);
                            historyDoc.status = "assigned";
                            historyDoc.bricoler = bidDetails.user;
                            _context5.next = 33;
                            return historyDoc.save();

                        case 33:
                            _context5.t0 = console;
                            _context5.next = 36;
                            return _history2.default.findOne(historyQuery);

                        case 36:
                            _context5.t1 = _context5.sent;

                            _context5.t0.log.call(_context5.t0, _context5.t1);

                            _context5.next = 40;
                            return _notification2.default.create({
                                targetUser: bidDetails.user,
                                subjectType: 'bid',
                                subject: bidDetails.id,
                                text: 'تم قبول عرضك من مالك الخدمة'
                            });

                        case 40:
                            newNoti = _context5.sent;


                            //send notifications
                            title = "تم قبول عرضك";
                            body = "تم قبول عرضك من مالك الخدمة،اعمل بجد لكسب الثقة من الجميع";

                            (0, _pushNotifications.send)(bidDetails.user, title, body);

                            //return result
                            return _context5.abrupt('return', res.status(204).end());

                        case 45:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, _this5);
        }))();
    },


    //refuse bid 
    refuseBid: function refuseBid(req, res, next) {
        var _this6 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
            var bidId, bricolId, bidDetails, bricolDetails, userId;
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            bidId = req.params.bidId;
                            bricolId = req.params.bricolId;
                            _context6.next = 4;
                            return _bid2.default.findById(bidId);

                        case 4:
                            bidDetails = _context6.sent;

                            if (bidDetails) {
                                _context6.next = 7;
                                break;
                            }

                            return _context6.abrupt('return', next(new _ApiError2.default(404)));

                        case 7:
                            _context6.next = 9;
                            return _bricole2.default.findById(bricolId);

                        case 9:
                            bricolDetails = _context6.sent;

                            if (bricolDetails) {
                                _context6.next = 12;
                                break;
                            }

                            return _context6.abrupt('return', next(new _ApiError2.default(404)));

                        case 12:
                            userId = req.user._id;

                            if (userId == bricolDetails.user) {
                                _context6.next = 15;
                                break;
                            }

                            return _context6.abrupt('return', next(new _ApiError2.default(403, 'not access to this resource')));

                        case 15:
                            //update bid 
                            bidDetails.status = 'refused';
                            _context6.next = 18;
                            return bidDetails.save();

                        case 18:
                            return _context6.abrupt('return', res.status(204).end());

                        case 19:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, _callee6, _this6);
        }))();
    },


    //make bricole in progress  
    makeBricolInProgress: function makeBricolInProgress(req, res, next) {
        var _this7 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
            var bidId, bricolId, bidDetails, bricolDetails, userId, historyQuery, historyDoc;
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            bidId = req.params.bidId;
                            bricolId = req.params.bricolId;
                            _context7.next = 4;
                            return _bid2.default.findById(bidId);

                        case 4:
                            bidDetails = _context7.sent;

                            if (bidDetails) {
                                _context7.next = 7;
                                break;
                            }

                            return _context7.abrupt('return', next(new _ApiError2.default(404)));

                        case 7:
                            _context7.next = 9;
                            return _bricole2.default.findById(bricolId);

                        case 9:
                            bricolDetails = _context7.sent;

                            if (bricolDetails) {
                                _context7.next = 12;
                                break;
                            }

                            return _context7.abrupt('return', next(new _ApiError2.default(404)));

                        case 12:
                            userId = req.user._id;

                            console.log(typeof userId === 'undefined' ? 'undefined' : _typeof(userId));

                            if (userId == bricolDetails.bricoler) {
                                _context7.next = 16;
                                break;
                            }

                            return _context7.abrupt('return', next(new _ApiError2.default(403, 'not access to this resource')));

                        case 16:
                            //update bricole by bricoler  
                            bricolDetails.status = 'inProgress';
                            _context7.next = 19;
                            return bricolDetails.save();

                        case 19:

                            //update bricole history 
                            historyQuery = {
                                serviceType: 'bricol',
                                service: bricolDetails.id,
                                user: bricolDetails.user
                            };
                            _context7.next = 22;
                            return _history2.default.findOne(historyQuery);

                        case 22:
                            historyDoc = _context7.sent;

                            console.log(historyDoc);
                            historyDoc.status = "inProgress";
                            _context7.next = 27;
                            return historyDoc.save();

                        case 27:
                            return _context7.abrupt('return', res.status(204).end());

                        case 28:
                        case 'end':
                            return _context7.stop();
                    }
                }
            }, _callee7, _this7);
        }))();
    }
};
//# sourceMappingURL=bid.controller.js.map