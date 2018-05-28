'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bricol = require('../controllers/bricol.controller');

var _bricol2 = _interopRequireDefault(_bricol);

var _bid = require('../controllers/bid.controller');

var _bid2 = _interopRequireDefault(_bid);

var _multer = require('../services/multer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.route('/').post((0, _multer.multerSaveTo)('bricol').array('imgs'), _bricol2.default.validateBody(), _bricol2.default.addNewBricol).get(_bricol2.default.retriveAllBricol);

router.route('/:bricolId').get(_bricol2.default.reriveOneBricolDetails);

router.route('/:bricolId/users/:usersId/distance-location').put(_bricol2.default.validateBodyOfCalulateDisance(), _bricol2.default.calculateDistance);

router.route('/:bricolId/bids/:bidId/accepted').put(_bid2.default.accepptBid);

router.route('/:bricolId/bids/:bidId/refused').put(_bid2.default.refuseBid);

router.route('/:bricolId/bids/:bidId/in-progress').put(_bid2.default.makeBricolInProgress);

exports.default = router;
//# sourceMappingURL=bricol.route.js.map