import express from 'express';
import BricolController from '../controllers/bricol.controller';
import BidController from '../controllers/bid.controller';
import { multerSaveTo } from '../services/multer'
const router = express.Router();

router.route('/')
    .post(
    multerSaveTo('bricol').array('imgs'),
    BricolController.validateBody(),
    BricolController.addNewBricol)
    .get(BricolController.retriveAllBricol)

router.route('/:bricolId')
    .get(BricolController.reriveOneBricolDetails)

router.route('/:bricolId/users/:usersId/distance-location')
    .put(
    BricolController.validateBodyOfCalulateDisance(),
    BricolController.calculateDistance)

router.route('/:bricolId/bids/:bidId/accepted')
    .put(BidController.accepptBid)

router.route('/:bricolId/bids/:bidId/refused')
    .put(BidController.refuseBid)

router.route('/:bricolId/bids/:bidId/in-progress')
    .put(BidController.makeBricolInProgress)


export default router;