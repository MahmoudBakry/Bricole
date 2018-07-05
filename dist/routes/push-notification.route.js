"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _pushNotifications = require("../controllers/push-notifications.controller");

var _pushNotifications2 = _interopRequireDefault(_pushNotifications);

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requireAuth = _passport2.default.authenticate('jwt', { session: false });

var router = _express2.default.Router();

router.post("/push-subscribe", requireAuth, _pushNotifications2.default.subscribe);
router.post("/push-unsubscribe", requireAuth, _pushNotifications2.default.unsubscribe);
router.post("/push-update", requireAuth, _pushNotifications2.default.update);

exports.default = router;
//# sourceMappingURL=push-notification.route.js.map