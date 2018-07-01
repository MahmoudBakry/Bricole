import TripBtCity from '../../models/trip-bt-ciy.model';
import User from '../../models/user.model';
import mongoose from 'mongoose';
import ApiResponse from '../../helpers/ApiResponse';
import ApiError from '../../helpers/ApiError';
import { body, param, validationResult } from 'express-validator/check';
import { toImgUrl } from '../../utils/index'
import { escapeRegExp } from 'lodash';

export default {

    //validation for create new bricol
    validateBody(isUpdate = false) {
        let validations = [
            body("from").exists().withMessage("from is required"),
            body("to").exists().withMessage("to is required"),
        ];
        return validations;
    },
    //create new trip logic
    async createNewTrip(req, res, next) {
        try {
            const validationErrors = validationResult(req).array();
            if (validationErrors.length > 0)
                return next(new ApiError(422, validationErrors));

            let bricolerId = req.params.bricolerId;
            let userDetails = await User.findById(bricolerId);
            if (!userDetails)
                return res.status(404).end();

            //prepare data 
            if (req.files.length > 0) {
                req.body.imgs = []
                for (let x = 0; x < req.files.length; x++) {
                    req.body.imgs.push(await toImgUrl(req.files[x]))
                }
            }
            req.body.travelingDate = parseInt(req.body.travelingDate)
            req.body.returnDate = parseInt(req.body.returnDate)
            req.body.bricoler = req.params.bricolerId;

            let newDoc = await TripBtCity.create(req.body);
            return res.status(201).json(newDoc);
        } catch (err) {
            next(err)
        }
    },

    //retrive all trips bt cities 
    async fetchAllTripsBtCities(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 20;
            const page = req.query.page || 1;

            //filter it 
            let { status, from, to, tripType } = req.query;
            let query = {}

            if (status)
                query.status = status;

            if (from) {
                const matchQueryRegx = new RegExp(escapeRegExp(from), 'i')
                query.from = matchQueryRegx;
            }

            if (to) {
                const matchQueryRegxTo = new RegExp(escapeRegExp(to), 'i')
                query.to = matchQueryRegxTo;
            }

            if (tripType)
                query.tripType = tripType

            let allDocs = await TripBtCity.find(query)
                .populate('bricoler')
                .skip((page - 1) * limit)
                .limit(limit).sort({ creationDate: -1 })
            //return responce 
            let count = await TripBtCity.count(query);
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
    },
    //fetch all trips under one bricoler 
    async fetchAllTripsForOneBricoler(req, res, next) {
        try {
            let bricolerId = req.params.bricolerId;
            const limit = parseInt(req.query.limit) || 20;
            const page = req.query.page || 1;

            let userDetails = await User.findById(bricolerId);
            if (!userDetails)
                return res.status(404).end();
            //filter it 
            let { status, from, to, tripType } = req.query;
            let query = {}

            if (status)
                query.status = status;

            if (from) {
                const matchQueryRegx = new RegExp(escapeRegExp(from), 'i')
                query.from = matchQueryRegx;
            }

            if (to) {
                const matchQueryRegxTo = new RegExp(escapeRegExp(to), 'i')
                query.to = matchQueryRegxTo;
            }

            if (tripType)
                query.tripType = tripType
            query.bricoler = bricolerId;

            //data base query 
            let allDocs = await TripBtCity.find(query)
                .populate('bricoler')
                .skip((page - 1) * limit)
                .limit(limit).sort({ creationDate: -1 })

            //return responce 
            let count = await TripBtCity.count(query);
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
    },
}