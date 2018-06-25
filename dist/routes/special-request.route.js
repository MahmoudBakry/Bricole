'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _specialRequest = require('../controllers/bricoler/special-request.controller');

var _specialRequest2 = _interopRequireDefault(_specialRequest);

var _multer = require('../services/multer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.route('/bricolers/:bricolerId/request').post((0, _multer.multerSaveTo)('specialrequest').array('imgs'), _specialRequest2.default.validateBody(), _specialRequest2.default.createNewSpecialRequest);

router.route('/bricolers/:bricolerId/requests/:requestId').get(_specialRequest2.default.retriveOneRequestDetails);

exports.default = router;
//# sourceMappingURL=special-request.route.js.map