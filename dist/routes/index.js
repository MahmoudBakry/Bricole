'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _user = require('./user.route');

var _user2 = _interopRequireDefault(_user);

var _job = require('./job.route');

var _job2 = _interopRequireDefault(_job);

var _city = require('./city.route');

var _city2 = _interopRequireDefault(_city);

var _bricol = require('./bricol.route');

var _bricol2 = _interopRequireDefault(_bricol);

var _bid = require('./bid.route');

var _bid2 = _interopRequireDefault(_bid);

var _bricolBtCities = require('./bricol-bt-cities.routes');

var _bricolBtCities2 = _interopRequireDefault(_bricolBtCities);

var _bidBricolBtCity = require('./bid-bricol-bt-city.route');

var _bidBricolBtCity2 = _interopRequireDefault(_bidBricolBtCity);

var _admin = require('./admin.route');

var _admin2 = _interopRequireDefault(_admin);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requireAuth = _passport2.default.authenticate('jwt', { session: false });
var router = _express2.default.Router();

router.use('/', _user2.default);
router.use('/jobs', _job2.default);
router.use('/cities', _city2.default);

router.use('/bricoles', requireAuth, _bricol2.default);
router.use('/', _bid2.default);

router.use('/bricoles-cities', requireAuth, _bricolBtCities2.default);
router.use('/', _bidBricolBtCity2.default);

router.use('/admin', requireAuth, _admin2.default);

exports.default = router;
//# sourceMappingURL=index.js.map