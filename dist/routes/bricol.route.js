'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bricol = require('../controllers/bricol.controller');

var _bricol2 = _interopRequireDefault(_bricol);

var _multer = require('../services/multer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.route('/').post((0, _multer.multerSaveTo)('bricol').array('imgs'), _bricol2.default.validateBody(), _bricol2.default.addNewBricol).get(_bricol2.default.retriveAllBricol);

router.route('/:bricolId/users/:usersId/distance-location').put(_bricol2.default.calculateDistance);
exports.default = router;
//# sourceMappingURL=bricol.route.js.map