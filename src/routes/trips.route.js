import express from 'express';
import RequstTripBtCity from '../controllers/bricoler-bt-citty/request-trip.controller';
import { multerSaveTo } from '../services/multer'

const router = express.Router();

//routes
router.route('/trips/:tripId/requests')
    .post(RequstTripBtCity.createNewRequest)
    .get(RequstTripBtCity.retriveAllRequestUnderOneTrip)

router.route('/trips/:tripId/requests/:requestId')
    .get(RequstTripBtCity.retriveOneRequest)

router.route('/trips/:tripId/requests/:requestId/accept')
    .put(RequstTripBtCity.acceptRequest)

router.route('/trips/:tripId/requests/:requestId/ignore')
    .put(RequstTripBtCity.ignoreRequest)

export default router; 