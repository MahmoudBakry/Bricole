'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bid = require('../models/bid.model');

var _bid2 = _interopRequireDefault(_bid);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _ApiResponse = require('../helpers/ApiResponse');

var _ApiResponse2 = _interopRequireDefault(_ApiResponse);

var _ApiError = require('../helpers/ApiError');

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
            var validationErrors, bricolId, newBid;
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
                            bricolId = req.params.bricolId;

                            req.body.bricol = bricolId;
                            _context.next = 8;
                            return _bid2.default.create(req.body);

                        case 8:
                            newBid = _context.sent;
                            return _context.abrupt('return', res.status(201).json(newBid));

                        case 12:
                            _context.prev = 12;
                            _context.t0 = _context['catch'](0);

                            next(_context.t0);

                        case 15:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[0, 12]]);
        }))();
    },


    //retrive all Bid for one Bricol 
    retriveAllBidsForBricol: function retriveAllBidsForBricol(req, res, next) {
        var _this2 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var limit, page, bricolId, allDocs, count;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;
                            limit = parseInt(req.query.limit) || 20;
                            page = req.query.page || 1;
                            bricolId = req.params.bricolId;
                            _context2.next = 6;
                            return _bid2.default.find({ bricol: bricolId }).populate('user').populate('bricol').skip((page - 1) * limit).limit(limit).sort({ creationDate: -1 });

                        case 6:
                            allDocs = _context2.sent;
                            _context2.next = 9;
                            return _bid2.default.count({ bricol: bricolId });

                        case 9:
                            count = _context2.sent;
                            return _context2.abrupt('return', res.send(new _ApiResponse2.default(allDocs, page, Math.ceil(count / limit), limit, count, req)));

                        case 13:
                            _context2.prev = 13;
                            _context2.t0 = _context2['catch'](0);

                            next(_context2.t0);

                        case 16:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2, [[0, 13]]);
        }))();
    }
};
//# sourceMappingURL=bid.controller.js.map