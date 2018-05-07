import express from 'express';
import CityController from '../controllers/city.controller'
const router = express.Router();

router.route('/')
    .post(CityController.createCity)
    .get(CityController.allCities)
export default router;