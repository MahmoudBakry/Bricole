'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bid = require('../controllers/bid.controller');

var _bid2 = _interopRequireDefault(_bid);

var _multer = require('../services/multer');

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requireAuth = _passport2.default.authenticate('jwt', { session: false });
var router = _express2.default.Router();

router.route('/bids/:bidId').get(_bid2.default.bidDetails);

router.route('/bricoles/:bricolId/bids').post(requireAuth, _bid2.default.validateBody(), _bid2.default.createNewBid).get(requireAuth, _bid2.default.retriveAllBidsForBricol);

router.route('/bricoles/:bricolId/bids-count').get(requireAuth, _bid2.default.countNumberOfBidToONeBricol);

exports.default = router;
//# sourceMappingURL=bid.route.js.map