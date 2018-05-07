import City from '../models/city.model';
import mongoose from 'mongoose';
import ApiResponse from '../helpers/ApiResponse';
import ApiError from '../helpers/ApiError';

export default {
    async createCity(req, res, next) {
        try {
            let newCity = await City.create(req.body);
            return res.status(201).json(newCity);
        } catch (err) {
            next(err)
        }
    },

    //retrive all cities 
    async allCities(req, res, next) {
        try {
            let allDocs = await City.find();
            return res.status(200).json(allDocs);
        } catch (err) {
            next(err)
        }
    },

}


