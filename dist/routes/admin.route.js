'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _admin = require('../controllers/admin/admin.controller');

var _admin2 = _interopRequireDefault(_admin);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requireAuth = _passport2.default.authenticate('jwt', { session: false });
var router = _express2.default.Router();

router.route('/statistics').get(_admin2.default.retriveSomeNumbers);

router.route('/users').get(_admin2.default.retriveAllUsers);

exports.default = router;
//# sourceMappingURL=admin.route.js.map