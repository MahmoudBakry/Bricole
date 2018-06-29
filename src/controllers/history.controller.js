import History from '../models/history.model';
import User from '../models/user.model';
import mongoose from 'mongoose';
import ApiResponse from '../helpers/ApiResponse';
import ApiError from '../helpers/ApiError';

export default {
    //retrive all bricoler (provider) history 
    async retriveHistoryOfBricoler(req, res, next) {
        try {

            const limit = parseInt(req.query.limit) || 20;
            const page = req.query.page || 1;

            let bricolerId = req.params.bricolerId;
            let userDetails = await User.findById(bricolerId);

            if (!userDetails)
                return res.status(404).end();
            let query = {}
            if (req.query.status)
                query.status = req.query.status;
            if (req.query.serviceype)
                query.serviceType = req.query.serviceype;
            query.bricoler = bricolerId;
            let allDoc = await History.find(query)
                .populate('service')
                .populate('bricoler')
                .populate('user')
                .skip((page - 1) * limit)
                .limit(limit).sort({ creationDate: -1 })

            let count = await History.count(query);
            return res.send(new ApiResponse(
                allDoc,
                page,
                Math.ceil(count / limit),
                limit,
                count,
                req
            ))


        } catch (err) {
            next(err)
        }
    },

    //retrive all user (client) history 
    async retriveHistoryOfUser(req, res, next) {
        try {

            const limit = parseInt(req.query.limit) || 20;
            const page = req.query.page || 1;

            let userId = req.params.userId;
            let userDetails = await User.findById(userId);
            if (!userDetails)
                return res.status(404).end();
            let query = {}
            if (req.query.status)
                query.status = req.query.status;
            if (req.query.serviceype)
                query.serviceType = req.query.serviceype;
            query.user = userId;
            let allDoc = await History.find(query)
                .populate('service')
                .populate('bricoler')
                .populate('user')
                .skip((page - 1) * limit)
                .limit(limit).sort({ creationDate: -1 })

            let count = await History.count(query);
            return res.send(new ApiResponse(
                allDoc,
                page,
                Math.ceil(count / limit),
                limit,
                count,
                req
            ))

        } catch (err) {
            next(err)
        }
    }
}


