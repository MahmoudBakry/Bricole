import UserController from '../controllers/user.controller'
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

router.post("/signin", requireSignIn, UserController.signin);


export default router;


