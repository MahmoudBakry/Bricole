import express from 'express';
import BidController from '../controllers/bid.controller';
import { multerSaveTo } from '../services/multer';
import passport from "passport";
const requireAuth = passport.authenticate('jwt', { session: false });
const router = express.Router();

router.route('/bids/:bidId')
    .get(BidController.bidDetails)

router.route('/bricoles/:bricolId/bids')
    .post(requireAuth,
    BidController.validateBody(),
    BidController.createNewBid)
    .get(requireAuth, BidController.retriveAllBidsForBricol)

router.route('/bricoles/:bricolId/bids-count')
    .get(requireAuth, BidController.countNumberOfBidToONeBricol)


export default router;