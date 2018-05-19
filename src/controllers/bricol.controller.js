import Bricol from '../models/bricole.model';
import mongoose from 'mongoose';
import ApiResponse from '../helpers/ApiResponse';
import ApiError from '../helpers/ApiError';
import { toImgUrl } from '../utils/index'
import { body, param, validationResult } from 'express-validator/check';
import { escapeRegExp } from 'lodash';
export default {

    //validation for create new bricol
    validateBody(isUpdate = false) {
        let validations = [
            body("title").exists().withMessage("title is required"),
            body("descripption").exists().withMessage("descripption is required"),
            body('lang').exists().withMessage("lang  is required"),
            body("lat").exists().withMessage("lat is required"),
            body("bricolerGender").exists().withMessage("bricolerGender is required"),
            body("vehicleToWork").exists().withMessage("vehicleToWork is required"),
            body("dueDate").exists().withMessage("dueDate is required")
        ];
        return validations;
    },

    //logic add new bricol
    async addNewBricol(req, res, next) {
        try {
            const validationErrors = validationResult(req).array();
            if (validationErrors.length > 0)
                return next(new ApiError(422, validationErrors));

            //prepare bricol data 
            if (req.files.length > 0) {
                req.body.imgs = []
                for (let x = 0; x < req.files.length; x++) {
                    req.body.imgs.push(await toImgUrl(req.files[x]))
                }
            } else
                return next(new ApiError(422, "imgs are required"))
            let lang = req.body.lang;   //long
            let lat = req.body.lat;//lat
            let bricolLocation = [lang, lat] //modify location 
            req.body.location = bricolLocation;
            req.body.user = req.user._id;
            req.body.dueDate = parseInt(req.body.dueDate)

            let newDoc = await Bricol.create(req.body);
            let createdDoc = await Bricol.findById(newDoc.id)
                .populate('user')
                .populate('job')
            return res.status(201).json(createdDoc);
        } catch (err) {
            next(err)
        }
    },

    //fetch all bricoles 
    async retriveAllBricol(req, res, next) {
        try {
            let { vehicleToWork, job, bricolerGender, startPrice, endPrice } = req.query
            let query = {};
            //filter by jobs
            if (job) {
                job = job.split(',');
                if (job.length > 1)
                    query.job = { $in: job };
                else
                    query.job = job[0];
            }
            //filter by vehicleToWork
            if (vehicleToWork) {
                vehicleToWork = vehicleToWork.split(',');
                if (vehicleToWork.length > 1)
                    query.vehicleToWork = { $in: vehicleToWork };
                else
                    query.vehicleToWork = vehicleToWork[0];
            }
            //filter by bricolerGender
            if (bricolerGender)
                query.bricolerGender = bricolerGender;
            //filteration by start & end price [budget]
            if (startPrice)
                query.budget = { $gte: +startPrice };
            if (endPrice)
                query.budget = { ...query.budget, $lte: +endPrice };
            //search by word in title of bricol 
            if (req.query.q) {
                const matchQueryRegx = new RegExp(escapeRegExp(req.query.q), 'i')
                query.title = matchQueryRegx;
            }

            //sorted docs
            let sort = {}
            if (req.query.maxPrice) {
                sort.budget = -1;
                sort.creationDate = -1;
            }

            if(req.query.minPrice){
                sort.budget = 1;
                sort.creationDate = -1;
            }
            const limit = parseInt(req.query.limit) || 20;
            const page = req.query.page || 1;

            let allDocs = await Bricol.find(query)
                .populate('user')
                .populate('job')
                .skip((page - 1) * limit)
                .limit(limit).sort(sort)
            let count = await Bricol.count(query);

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

