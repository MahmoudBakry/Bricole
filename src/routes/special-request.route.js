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

export default router;