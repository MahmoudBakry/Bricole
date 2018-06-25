import UserController from '../controllers/user.controller';
import BricolerController from '../controllers/bricoler/bricoler.controller';
import express from 'express';
import passport from 'passport';
import passportService from '../services/passport';
import { multerSaveTo } from '../services/multer'
const requireSignIn = passport.authenticate('local', { session: false });
const requireAuth = passport.authenticate('jwt', { session: false });
const router = express.Router();

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

//requests
router.route('/bricolers/:bricolerId/special-requests')
    .get(requireAuth, BricolerController.fetchRequestOfOneBricoler)

router.route('/bricolers/:bricolerId/bricols-bt-city')
    .get(requireAuth, UserController.retriveAllBricolsBtCityOfBricoler)

router.route('/bricolers/:bricolerId/bricols')
    .get(requireAuth, UserController.fetchAllBricolOfOneBricoler)

router.route('/bricolers/:bricolerId/bricols-statistics')
    .get(requireAuth, UserController.countNumberOfBricolsOfBricoler)


export default router;


