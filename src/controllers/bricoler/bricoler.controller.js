import User from '../../models/user.model';
import mongoose from 'mongoose';
import ApiResponse from '../../helpers/ApiResponse';
import ApiError from '../../helpers/ApiError';
import { body, param, validationResult } from 'express-validator/check';
import { escapeRegExp } from 'lodash';
import * as _ from 'lodash';


export default {
    //retrive all user that have complete profile 
    async fetchAllBricoler(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 200;
            const page = req.query.page || 1;
            let { jobs, gender } = req.query
            let query = {};
            //filter by gender
            if (gender)
                query.gender = gender;
            //search by word in about of bricoler (user)
            if (req.query.q) {
                const matchQueryRegx = new RegExp(escapeRegExp(req.query.q), 'i')
                query.about = matchQueryRegx;
            }
            query.completed = true

            let allDocs = await User.find(query)
                .populate('city')
                .populate('jobs')
                .skip((page - 1) * limit)
                .limit(limit).sort({ creationDate: -1 })

            let count = await User.count(query);
            return res.send(new ApiResponse(
                allDocs,
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