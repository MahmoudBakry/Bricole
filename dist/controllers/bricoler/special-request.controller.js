'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _user = require('../../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _specialRequest = require('../../models/special-request.model');

var _specialRequest2 = _interopRequireDefault(_specialRequest);

var _history = require('../../models/history.model');

var _history2 = _interopRequireDefault(_history);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _ApiResponse = require('../../helpers/ApiResponse');

var _ApiResponse2 = _interopRequireDefault(_ApiResponse);

var _ApiError = require('../../helpers/ApiError');

var _ApiError2 = _interopRequireDefault(_ApiError);

var _check = require('express-validator/check');

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _index = require('../../utils/index');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {

    //validation for create new request
    validateBody: function validateBody() {
        var isUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var validations = [(0, _check.body)("title").exists().withMessage("title is required"), (0, _check.body)("description").exists().withMessage("descripption is required"), (0, _check.body)('lang').exists().withMessage("lang  is required"), (0, _check.body)("lat").exists().withMessage("lat is required"), (0, _check.body)("dueDate").exists().withMessage("dueDate is required")];
        return validations;
    },
    createNewSpecialRequest: function createNewSpecialRequest(req, res, next) {
        var _this = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var validationErrors, bricolerId, x, lang, lat, requestLocation, newDoc, createdDoc, historyObject, historyDoc;
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
                            bricolerId = req.params.bricolerId;
                            //prepare data 

                            if (!(req.files.length > 0)) {
                                _context.next = 17;
                                break;
                            }

                            req.body.imgs = [];
                            x = 0;

                        case 8:
                            if (!(x < req.files.length)) {
                                _context.next = 17;
                                break;
                            }

                            _context.t0 = req.body.imgs;
                            _context.next = 12;
                            return (0, _index.toImgUrl)(req.files[x]);

                        case 12:
                            _context.t1 = _context.sent;

                            _context.t0.push.call(_context.t0, _context.t1);

                        case 14:
                            x++;
                            _context.next = 8;
                            break;

                        case 17:
                            lang = req.body.lang; //long

                            lat = req.body.lat; //lat

                            requestLocation = [lang, lat]; //modify location 

                            req.body.location = requestLocation;
                            req.body.dueDate = parseInt(req.body.dueDate);
                            req.body.user = req.user.id;
                            req.body.bricoler = bricolerId;

                            //create new doc 
                            _context.next = 26;
                            return _specialRequest2.default.create(req.body);

                        case 26:
                            newDoc = _context.sent;
                            _context.next = 29;
                            return _specialRequest2.default.findById(newDoc.id).populate('user').populate('bricoler');

                        case 29:
                            createdDoc = _context.sent;


                            //create history doc 
                            historyObject = {
                                serviceType: 'special-request',
                                service: createdDoc.id,
                                user: createdDoc.user,
                                bricoler: createdDoc.bricoler,
                                status: 'pendding'
                            };
                            _context.next = 33;
                            return _history2.default.create(historyObject);

                        case 33:
                            historyDoc = _context.sent;
                            return _context.abrupt('return', res.status(201).json(createdDoc));

                        case 37:
                            _context.prev = 37;
                            _context.t2 = _context['catch'](0);

                            next(_context.t2);

                        case 40:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[0, 37]]);
        }))();
    },


    //retrive one request 
    retriveOneRequestDetails: function retriveOneRequestDetails(req, res, next) {
        var _this2 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var bricolerId, bricolerDetails, requestId, requestDetails;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;
                            bricolerId = req.params.bricolerId;
                            _context2.next = 4;
                            return _user2.default.findById(bricolerId);

                        case 4:
                            bricolerDetails = _context2.sent;

                            if (!bricolerDetails) res.status(404).end();
                            requestId = req.params.requestId;
                            _context2.next = 9;
                            return _specialRequest2.default.findById(requestId).populate('user').populate('bricoler');

                        case 9:
                            requestDetails = _context2.sent;

                            if (requestDetails) {
                                _context2.next = 12;
                                break;
                            }

                            return _context2.abrupt('return', res.status(404).end());

                        case 12:
                            return _context2.abrupt('return', res.status(200).json(requestDetails));

                        case 15:
                            _context2.prev = 15;
                            _context2.t0 = _context2['catch'](0);

                            next(_context2.t0);

                        case 18:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2, [[0, 15]]);
        }))();
    },


    //accept request by bricoler 
    acceptRequest: function acceptRequest(req, res, next) {
        var _this3 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            var bricolerId, bricolerDetails, requestId, requestDetails, newDoc, historyQuery, historyDoc;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.prev = 0;
                            bricolerId = req.params.bricolerId;
                            _context3.next = 4;
                            return _user2.default.findById(bricolerId);

                        case 4:
                            bricolerDetails = _context3.sent;

                            if (!bricolerDetails) res.status(404).end();

                            requestId = req.params.requestId;
                            _context3.next = 9;
                            return _specialRequest2.default.findById(requestId);

                        case 9:
                            requestDetails = _context3.sent;

                            if (requestDetails) {
                                _context3.next = 12;
                                break;
                            }

                            return _context3.abrupt('return', res.status(404).end());

                        case 12:

                            if (!(req.user.id == requestDetails.bricoler)) next(new _ApiError2.default(403, 'must bricoler only can accept it'));

                            requestDetails.status = "accepted";
                            _context3.next = 16;
                            return requestDetails.save();

                        case 16:
                            _context3.next = 18;
                            return _specialRequest2.default.findById(requestDetails.id).populate('user').populate('bricoler');

                        case 18:
                            newDoc = _context3.sent;


                            //update bricole history 
                            historyQuery = {
                                serviceType: 'special-request',
                                service: requestDetails.id,
                                user: requestDetails.user,
                                bricoler: requestDetails.bricoler
                            };
                            _context3.next = 22;
                            return _history2.default.findOne(historyQuery);

                        case 22:
                            historyDoc = _context3.sent;

                            console.log(historyDoc);
                            historyDoc.status = "accepted";
                            _context3.next = 27;
                            return historyDoc.save();

                        case 27:
                            return _context3.abrupt('return', res.status(200).json(newDoc));

                        case 30:
                            _context3.prev = 30;
                            _context3.t0 = _context3['catch'](0);

                            next(_context3.t0);

                        case 33:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, _this3, [[0, 30]]);
        }))();
    },

    //ignore request by bricoler 
    ignoreRequst: function ignoreRequst(req, res, next) {
        var _this4 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
            var bricolerId, bricolerDetails, requestId, requestDetails, newDoc, historyQuery, historyDoc;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.prev = 0;
                            bricolerId = req.params.bricolerId;
                            _context4.next = 4;
                            return _user2.default.findById(bricolerId);

                        case 4:
                            bricolerDetails = _context4.sent;

                            if (!bricolerDetails) res.status(404).end();

                            requestId = req.params.requestId;
                            _context4.next = 9;
                            return _specialRequest2.default.findById(requestId);

                        case 9:
                            requestDetails = _context4.sent;

                            if (requestDetails) {
                                _context4.next = 12;
                                break;
                            }

                            return _context4.abrupt('return', res.status(404).end());

                        case 12:

                            if (!(req.user.id == requestDetails.bricoler)) next(new _ApiError2.default(403, 'must bricoler only can ignored it'));

                            requestDetails.status = "ignored";
                            _context4.next = 16;
                            return requestDetails.save();

                        case 16:
                            _context4.next = 18;
                            return _specialRequest2.default.findById(requestDetails.id).populate('user').populate('bricoler');

                        case 18:
                            newDoc = _context4.sent;


                            //update bricole history 
                            historyQuery = {
                                serviceType: 'special-request',
                                service: requestDetails.id,
                                user: requestDetails.user,
                                bricoler: requestDetails.bricoler
                            };
                            _context4.next = 22;
                            return _history2.default.findOne(historyQuery);

                        case 22:
                            historyDoc = _context4.sent;

                            console.log(historyDoc);
                            historyDoc.status = "ignored";
                            _context4.next = 27;
                            return historyDoc.save();

                        case 27:
                            return _context4.abrupt('return', res.status(200).json(newDoc));

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
    }
};
//# sourceMappingURL=special-request.controller.js.map