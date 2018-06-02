'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bidBricolBtCity = require('../controllers/bricol-bt-cities/bid.bricol-bt-city.controller');

var _bidBricolBtCity2 = _interopRequireDefault(_bidBricolBtCity);

var _multer = require('../services/multer');

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requireAuth = _passport2.default.authenticate('jwt', { session: false });
var router = _express2.default.Router();

router.route('/bricoles-cities/:bricolId/bids').post(requireAuth, _bidBricolBtCity2.default.validateBody(), _bidBricolBtCity2.default.createNewBid);

exports.default = router;
//# sourceMappingURL=bid-bricol-bt-city.route.js.map