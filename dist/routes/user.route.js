'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _user = require('../controllers/user.controller');

var _user2 = _interopRequireDefault(_user);

var _bricoler = require('../controllers/bricoler/bricoler.controller');

var _bricoler2 = _interopRequireDefault(_bricoler);

var _history = require('../controllers/history.controller');

var _history2 = _interopRequireDefault(_history);

var _trip = require('../controllers/bricoler-bt-citty/trip.controller');

var _trip2 = _interopRequireDefault(_trip);

var _favourite = require('../controllers/favourite/favourite.controller');

var _favourite2 = _interopRequireDefault(_favourite);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passport3 = require('../services/passport');

var _passport4 = _interopRequireDefault(_passport3);

var _multer = require('../services/multer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requireSignIn = _passport2.default.authenticate('local', { session: false });
var requireAuth = _passport2.default.authenticate('jwt', { session: false });
var router = _express2.default.Router();

router.route('/signup').post((0, _multer.multerSaveTo)('users').single('img'), _user2.default.validateBody(), _user2.default.signUp);

router.post("/signin", requireSignIn, _user2.default.signin);

router.route('/bricolers').get(requireAuth, _bricoler2.default.fetchAllBricoler);

router.route('/users/:userId').get(requireAuth, _user2.default.retriveUserDetails);

router.route('/users/:userId/complete-profile').put(requireAuth, (0, _multer.multerSaveTo)('users').array('portofolio'), _user2.default.validateCompleteProfileBody(), _user2.default.completeProfile);

router.route('/users/:userId/bricols').get(requireAuth, _user2.default.fetchAllBricolOfOneUser);

router.route('/users/:userId/bricols-bt-city').get(requireAuth, _user2.default.retriveAllBricolsBtCityOfUser);

router.route('/users/:userId/bricols-statistics').get(requireAuth, _user2.default.countNumberOfBricolsOfUser);

//favourite routes 
router.route('/users/:userId/favourites').post(requireAuth, _favourite2.default.addFavouriteToMyList).get(requireAuth, _favourite2.default.retriveAllFavouriteBricolersOfOneUser);

//requests
router.route('/bricolers/:bricolerId/special-requests').get(requireAuth, _bricoler2.default.fetchRequestOfOneBricoler);

router.route('/bricolers/:bricolerId/bricols-bt-city').get(requireAuth, _user2.default.retriveAllBricolsBtCityOfBricoler);

router.route('/bricolers/:bricolerId/bricols').get(requireAuth, _user2.default.fetchAllBricolOfOneBricoler);

router.route('/bricolers/:bricolerId/bricols-statistics').get(requireAuth, _user2.default.countNumberOfBricolsOfBricoler);

//history
router.route('/bricolers/:bricolerId/history').get(requireAuth, _history2.default.retriveHistoryOfBricoler);

router.route('/users/:userId/history').get(requireAuth, _history2.default.retriveHistoryOfUser);

//trip routes 
router.route('/bricolers/:bricolerId/trip-bt-city').post(requireAuth, (0, _multer.multerSaveTo)('trip').array('imgs'), _trip2.default.validateBody(), _trip2.default.createNewTrip).get(requireAuth, _trip2.default.fetchAllTripsBtCities);

router.route('/bricolers/:bricolerId/my-trip-bt-city').get(requireAuth, _trip2.default.fetchAllTripsForOneBricoler);

exports.default = router;
//# sourceMappingURL=user.route.js.map