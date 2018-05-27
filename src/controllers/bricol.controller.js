import Bricol from '../models/bricole.model';
import User from '../models/user.model';
import Bid from '../models/bid.model';
import mongoose from 'mongoose';
import ApiResponse from '../helpers/ApiResponse';
import ApiError from '../helpers/ApiError';
import { toImgUrl } from '../utils/index'
import { body, param, validationResult } from 'express-validator/check';
import { escapeRegExp } from 'lodash';
import * as _ from 'lodash';

let deg2rad = (deg) => {
    return deg * (Math.PI / 180)
}

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
            let { vehicleToWork, jobs, bricolerGender, startPrice, endPrice } = req.query
            let query = {};
            //filter by jobs
            if (jobs) {
                jobs = jobs.split(',');
                if (jobs.length > 1)
                    query.job = { $in: jobs };
                else
                    query.job = jobs[0];
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

            if (req.query.minPrice) {
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

            //prepare response 

            //1 - calculate distance between user and bricol
            let userLocation = req.user.location;
            let result = []
            for (let x = 0; x < allDocs.length; x++) {
                let bricolLocationToDistance = allDocs[x].location;

                //first locattion point
                let lang1 = parseFloat(bricolLocationToDistance[0]);
                let lat1 = parseFloat(bricolLocationToDistance[1]);
                console.log(lang1)

                //scound location point
                let lang2 = parseFloat(userLocation[0]);
                let lat2 = parseFloat(userLocation[1]);

                let R = 6371; // Radius of the earth in km
                let dLat = deg2rad(lat2 - lat1);  // deg2rad above
                let dLon = deg2rad(lang2 - lang1);
                let a =
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                let d = R * c; // Distance in km
                //console.log(d)

                //get count of bids for each bricol
                let countOfBids = await Bid.count({ bricol: allDocs[x].id })
                result.push({ bricol: allDocs[x], distanceInKm: d, countOfBids })
            }

            let count = await Bricol.count(query);
            return res.send(new ApiResponse(
                result,
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
    //validation input of calulate price 
    validateBodyOfCalulateDisance() {
        return [
            body("bricol").exists().withMessage("bricol location is required"),
            body("user").exists().withMessage("user location is required")
        ]
    },
    //calculate distance between bricole and user 
    async calculateDistance(req, res, next) {
        try {
            const validationErrors = validationResult(req).array();
            if (validationErrors.length > 0)
                return next(new ApiError(422, validationErrors));
            //first locattion point
            let lang1 = parseFloat(req.body.bricol.lang);
            let lat1 = parseFloat(req.body.bricol.lat);
            //scound location point
            let lang2 = parseFloat(req.body.user.lang);
            let lat2 = parseFloat(req.body.user.lat);

            let R = 6371; // Radius of the earth in km
            let dLat = deg2rad(lat2 - lat1);  // deg2rad above
            let dLon = deg2rad(lang2 - lang1);
            let a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            let d = R * c; // Distance in km
            console.log(d);
            return res.status(200).json({ distanceInKm: d })
        } catch (err) {
            next(err)
        }
    },
    //retrive one bricol 
    async reriveOneBricolDetails(req, res, next) {
        let bricolId = req.params.bricolId;
        try {
            let bricolDetails = await Bricol.findById(bricolId)
                .populate('user')
                .populate('job')

            if (!bricolDetails)
                return res.status(404).end();

            let countOfBids = await Bid.count({bricol : bricolDetails.id})    
            return res.status(200).json({ bricol : bricolDetails , countOfBids : countOfBids})
        } catch (err) {
            next(err)
        }
    },
    //retrive all bids under one bricol 
    async retriveAllBidsToOneBricol(req, res, next) {

    },
}

