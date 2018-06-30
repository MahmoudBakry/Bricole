import AdminController from '../controllers/admin/admin.controller';
import passport from 'passport';
import express from 'express';

const requireAuth = passport.authenticate('jwt', { session: false });
const router = express.Router();

router.route('/statistics')
    .get(AdminController.retriveSomeNumbers)

router.route('/users')
    .get(AdminController.retriveAllUsers)

router.route('/bricols')
    .get(AdminController.fechAllBricols)

router.route('/bricols-bt-city')
    .get(AdminController.fechAllBricolsBtCity)

router.route('/bricolers')
    .get(AdminController.fetchCompleteProfileUsers)

export default router;