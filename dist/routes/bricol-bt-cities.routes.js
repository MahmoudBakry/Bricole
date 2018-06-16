'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bricolBtCities = require('../controllers/bricol-bt-cities/bricol-bt-cities.controller');

var _bricolBtCities2 = _interopRequireDefault(_bricolBtCities);

var _bidBricolBtCity = require('../controllers/bricol-bt-cities/bid.bricol-bt-city.controller');

var _bidBricolBtCity2 = _interopRequireDefault(_bidBricolBtCity);

var _multer = require('../services/multer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.route('/').post((0, _multer.multerSaveTo)('bricolBtCities').array('imgs'), _bricolBtCities2.default.validateBody(), _bricolBtCities2.default.createNewBricole).get(_bricolBtCities2.default.retriveAllBricol);

router.route('/:bricolId').get(_bricolBtCities2.default.retriveOneBricoleDetails);

router.route('/:bricolId/bids/:bidId/accepted').put(_bidBricolBtCity2.default.accepptBid);

exports.default = router;
//# sourceMappingURL=bricol-bt-cities.routes.js.map