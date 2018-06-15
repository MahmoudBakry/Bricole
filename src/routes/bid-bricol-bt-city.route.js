import express from 'express';
import BidController from '../controllers/bricol-bt-cities/bid.bricol-bt-city.controller';
import { multerSaveTo } from '../services/multer';
import passport from "passport";
const requireAuth = passport.authenticate('jwt', { session: false });
const router = express.Router();


router.route('/bricoles-cities/:bricolId/bids')
    .post(requireAuth,
    BidController.validateBody(),
    BidController.createNewBid)
    .get(requireAuth, BidController.retriveAllBidsOfOneBricole)



export default router;