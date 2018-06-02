import express from 'express';
import BricolBtCityController from '../controllers/bricol-bt-cities/bricol-bt-cities.controller';
import { multerSaveTo } from '../services/multer'
const router = express.Router();

router.route('/')
    .post(
    multerSaveTo('bricolBtCities').array('imgs'),
    BricolBtCityController.validateBody(),
    BricolBtCityController.createNewBricole)
    .get(BricolBtCityController.retriveAllBricol)

router.route('/:bricolId')
    .get(BricolBtCityController.retriveOneBricoleDetails)

export default router;