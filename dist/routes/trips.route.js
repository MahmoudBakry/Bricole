'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _requestTrip = require('../controllers/bricoler-bt-citty/request-trip.controller');

var _requestTrip2 = _interopRequireDefault(_requestTrip);

var _multer = require('../services/multer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

//routes
router.route('/trips/:tripId/requests').post(_requestTrip2.default.createNewRequest).get(_requestTrip2.default.retriveAllRequestUnderOneTrip);

router.route('/trips/:tripId/requests/:requestId').get(_requestTrip2.default.retriveOneRequest);

router.route('/trips/:tripId/requests/:requestId/accept').put(_requestTrip2.default.acceptRequest);

router.route('/trips/:tripId/requests/:requestId/ignore').put(_requestTrip2.default.ignoreRequest);

exports.default = router;
//# sourceMappingURL=trips.route.js.map