import History from '../models/history.model';
import mongoose from 'mongoose';
import ApiResponse from '../helpers/ApiResponse';
import ApiError from '../helpers/ApiError';

export default {
    //retrive all bricole history 
    async retriveHistory(req, res, next) {
        try {
            let allDoc = await History.find()
                .populate('service')
            return res.status(200).json(allDoc);
        } catch (err) {
            next(err)
        }
    }
}


