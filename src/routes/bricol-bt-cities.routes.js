import express from 'express';
import BricolBtCityController from '../controllers/bricol-bt-cities/bricol-bt-cities.controller';
import BidController from '../controllers/bricol-bt-cities/bid.bricol-bt-city.controller';
import { multerSaveTo } from '../services/multer';
const router = express.Router();

router.route('/')
    .post(
    multerSaveTo('bricolBtCities').array('imgs'),
    BricolBtCityController.validateBody(),
    BricolBtCityController.createNewBricole)
    .get(BricolBtCityController.retriveAllBricol)

router.route('/:bricolId')
    .get(BricolBtCityController.retriveOneBricoleDetails)

//routes for bids 
router.route('/:bricolId/bids/:bidId/accepted')
    .put(BidController.accepptBid)

router.route('/:bricolId/bids/:bidId/in-progress')
    .put(BidController.makeBricolInProgress)


export default router;