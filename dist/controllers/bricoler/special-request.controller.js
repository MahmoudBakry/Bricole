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
            var validationErrors, bricolerId, x, lang, lat, requestLocation, newDoc, createdDoc;
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
                                _context.next = 19;
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
                            _context.next = 20;
                            break;

                        case 19:
                            return _context.abrupt('return', next(new _ApiError2.default(422, "imgs are required")));

                        case 20:
                            lang = req.body.lang; //long

                            lat = req.body.lat; //lat

                            requestLocation = [lang, lat]; //modify location 

                            req.body.location = requestLocation;
                            req.body.dueDate = parseInt(req.body.dueDate);
                            req.body.user = req.user.id;
                            req.body.bricoler = bricolerId;

                            //create new doc 
                            _context.next = 29;
                            return _specialRequest2.default.create(req.body);

                        case 29:
                            newDoc = _context.sent;
                            _context.next = 32;
                            return _specialRequest2.default.findById(newDoc.id).populate('user').populate('bricoler');

                        case 32:
                            createdDoc = _context.sent;
                            return _context.abrupt('return', res.status(201).json(createdDoc));

                        case 36:
                            _context.prev = 36;
                            _context.t2 = _context['catch'](0);

                            next(_context.t2);

                        case 39:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[0, 36]]);
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
    }
};
//# sourceMappingURL=special-request.controller.js.map