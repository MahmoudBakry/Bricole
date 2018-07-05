import UserController from '../controllers/user.controller';
import BricolerController from '../controllers/bricoler/bricoler.controller';
import HistoryController from '../controllers/history.controller';
import TripBtCityController from '../controllers/bricoler-bt-citty/trip.controller';
import FavouriteController from '../controllers/favourite/favourite.controller';
import NotificationController from '../controllers/notification.controller';

import pushRoute from "./push-notification.route";
import express from 'express';
import passport from 'passport';
import passportService from '../services/passport';
import { multerSaveTo } from '../services/multer'
const requireSignIn = passport.authenticate('local', { session: false });
const requireAuth = passport.authenticate('jwt', { session: false });
const router = express.Router();

//notifications routes
router.use(pushRoute);

router.route('/signup')
    .post(
    multerSaveTo('users').single('img'),
    UserController.validateBody(),
    UserController.signUp
    )

router.post("/signin", requireSignIn, UserController.signin)

router.route('/bricolers', )
    .get(requireAuth, BricolerController.fetchAllBricoler)

router.route('/users/:userId')
    .get(requireAuth, UserController.retriveUserDetails)

router.route('/users/:userId/complete-profile')
    .put(requireAuth,
    multerSaveTo('users').array('portofolio'),
    UserController.validateCompleteProfileBody(),
    UserController.completeProfile)


router.route('/users/:userId/bricols')
    .get(requireAuth, UserController.fetchAllBricolOfOneUser)

router.route('/users/:userId/bricols-bt-city')
    .get(requireAuth, UserController.retriveAllBricolsBtCityOfUser)

router.route('/users/:userId/bricols-statistics')
    .get(requireAuth, UserController.countNumberOfBricolsOfUser)

//favourite routes 
router.route('/users/:userId/favourites')
    .post(requireAuth, FavouriteController.addFavouriteToMyList)
    .get(requireAuth, FavouriteController.retriveAllFavouriteBricolersOfOneUser)

//requests
router.route('/bricolers/:bricolerId/special-requests')
    .get(requireAuth, BricolerController.fetchRequestOfOneBricoler)

router.route('/bricolers/:bricolerId/bricols-bt-city')
    .get(requireAuth, UserController.retriveAllBricolsBtCityOfBricoler)

router.route('/bricolers/:bricolerId/bricols')
    .get(requireAuth, UserController.fetchAllBricolOfOneBricoler)

router.route('/bricolers/:bricolerId/bricols-statistics')
    .get(requireAuth, UserController.countNumberOfBricolsOfBricoler)

//history
router.route('/bricolers/:bricolerId/history')
    .get(requireAuth, HistoryController.retriveHistoryOfBricoler)

router.route('/users/:userId/history')
    .get(requireAuth, HistoryController.retriveHistoryOfUser)

//trip routes 
router.route('/bricolers/:bricolerId/trip-bt-city')
    .post(requireAuth,
    multerSaveTo('trip').array('imgs'),
    TripBtCityController.validateBody(),
    TripBtCityController.createNewTrip)
    .get(requireAuth, TripBtCityController.fetchAllTripsBtCities)

router.route('/bricolers/:bricolerId/my-trip-bt-city')
    .get(requireAuth, TripBtCityController.fetchAllTripsForOneBricoler)

//notification routes 
router.route("/users/:userId/notification")
    .get(requireAuth, NotificationController.retriveAllNotification)


export default router;


