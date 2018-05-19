import express from 'express';
import BidController from '../controllers/bid.controller';
import { multerSaveTo } from '../services/multer';
import passport from "passport";
const requireAuth = passport.authenticate('jwt', { session: false });
const router = express.Router();

router.route('/bricoles/:bricolId/bids')
    .post(requireAuth,
    BidController.validateBody(),
    BidController.createNewBid)
    .get(requireAuth, BidController.retriveAllBidsForBricol)


export default router;