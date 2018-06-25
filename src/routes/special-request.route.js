import express from 'express';
import specialRequestController from '../controllers/bricoler/special-request.controller';
import { multerSaveTo } from '../services/multer';
const router = express.Router();


router.route('/bricolers/:bricolerId/request')
    .post(
    multerSaveTo('specialrequest').array('imgs'),
    specialRequestController.validateBody(),
    specialRequestController.createNewSpecialRequest);

router.route('/bricolers/:bricolerId/requests/:requestId')
    .get(specialRequestController.retriveOneRequestDetails)

router.route('/bricolers/:bricolerId/requests/:requestId/accept')
    .put(specialRequestController.acceptRequest)

router.route('/bricolers/:bricolerId/requests/:requestId/ignore')
    .put(specialRequestController.ignoreRequst)

export default router;