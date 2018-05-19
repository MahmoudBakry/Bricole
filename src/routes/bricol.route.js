import express from 'express';
import BricolController from '../controllers/bricol.controller';
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


export default router;