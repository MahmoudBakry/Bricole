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


export default router;