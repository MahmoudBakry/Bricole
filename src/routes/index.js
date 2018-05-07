import userRoutes from './user.route';
import JobRoutes from './job.route'
import CityRoutes from './city.route'
import express from 'express';
import passport from "passport";
const requireAuth = passport.authenticate('jwt', { session: false });
const router = express.Router();


router.use('/', userRoutes);
router.use('/jobs', JobRoutes);
router.use('/cities', CityRoutes)
export default router;