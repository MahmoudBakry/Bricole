import userRoutes from './user.route';
import JobRoutes from './job.route';
import CityRoutes from './city.route';
import BricolRoutes from './bricol.route';
import BidRoutes from './bid.route';
import BricolBtCitiesRoutes from './bricol-bt-cities.routes';
import BidBtCities from './bid-bricol-bt-city.route';

import express from 'express';
import passport from "passport";
const requireAuth = passport.authenticate('jwt', { session: false });
const router = express.Router();


router.use('/', userRoutes);
router.use('/jobs', JobRoutes);
router.use('/cities', CityRoutes)

router.use('/bricoles', requireAuth, BricolRoutes)
router.use('/', BidRoutes)

router.use('/bricoles-cities', requireAuth, BricolBtCitiesRoutes)
router.use('/', BidBtCities)

export default router;