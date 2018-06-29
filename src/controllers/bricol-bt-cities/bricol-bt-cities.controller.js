import BricolBtCities from '../../models/bricol-bt-cities.model';
import Bid from '../../models/bid.model';
import User from '../../models/user.model';
import History from '../../models/history.model';
import mongoose from 'mongoose';
import ApiResponse from '../../helpers/ApiResponse';
import ApiError from '../../helpers/ApiError';
import { toImgUrl } from '../../utils/index'
import { body, param, validationResult } from 'express-validator/check';
import { escapeRegExp } from 'lodash';
import * as _ from 'lodash';


export default {
    //validation for create new bricol between cities
    validateBody(isUpdate = false) {
        let validations = [
            body("title").exists().withMessage("title is required"),
            body("descripption").exists().withMessage("descripption is required"),
            body("bricolerGender").exists().withMessage("bricolerGender is required"),
            body("vehicleToWork").exists().withMessage("vehicleToWork is required"),
            body("dueDate").exists().withMessage("dueDate is required"),
            body("from").exists().withMessage("from city is required"),
            body("to").exists().withMessage("to city location is required"),
            body("budget").exists().withMessage("budget is required"),
        ];
        return validations;
    },

    //add new bricole between cities 
    async createNewBricole(req, res, next) {
        try {
            const validationErrors = validationResult(req).array();
            if (validationErrors.length > 0)
                return next(new ApiError(422, validationErrors));
            //prepare date 
            if (req.files.length > 0) {
                req.body.imgs = []
                for (let x = 0; x < req.files.length; x++) {
                    req.body.imgs.push(await toImgUrl(req.files[x]))
                }
            }
            req.body.dueDate = parseInt(req.body.dueDate)
            req.body.user = req.user._id;
            let newDoc = await BricolBtCities.create(req.body);
            let newDocDetails = await BricolBtCities.findById(newDoc.id)
                .populate('user')

            //create history doc 
            let historyObject = {
                serviceType: 'bricol-bt-cities',
                service: newDocDetails.id,
                user: newDocDetails.user,
            }
            let historyDoc = await History.create(historyObject);
            console.log(historyDoc.id)
            //return result 
            return res.status(201).json(newDocDetails);
        } catch (err) {
            next(err)
        }
    },

    //retrive one bricole details 
    async retriveOneBricoleDetails(req, res, next) {
        try {
            let bricolId = req.params.bricolId;
            let docDetails = await BricolBtCities.findById(bricolId)
                .populate('user')
                .populate('bricoler')

            if (!docDetails)
                return res.status(404).end();
            let query = {
                bricol: bricolId,
                bidType: 'betweenCity'
            }
            let bidCount = await Bid.count(query)
            return res.status(200).json({ bricol: docDetails, bidCount: bidCount });
        } catch (err) {
            next(err)
        }
    },

    //fetch all bricoles 
    async retriveAllBricol(req, res, next) {
        try {
            let { vehicleToWork, bricolerGender, startPrice, endPrice } = req.query
            let query = {};

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

            //filter only pendding bricole 
            query.status = "pendding"

            //sorted docs
            let sort = {}
            sort.creationDate = -1;
            if (req.query.maxPrice) {

                sort.budget = -1;
            }

            if (req.query.minPrice) {
                console.log('d')
                sort.budget = 1;
            }

            const limit = parseInt(req.query.limit) || 20;
            const page = req.query.page || 1;

            let allDocs = await BricolBtCities.find(query)
                .populate('user')
                .skip((page - 1) * limit)
                .limit(limit).sort(sort)

            //prepare response 
            let result = [];
            for (let x = 0; x < allDocs.length; x++) {
                //get count of bids for each bricol
                let bidQuery = {
                    bricol: allDocs[x].id,
                    bidType: 'bricol-bt-cities'
                }
                let countOfBids = await Bid.count(bidQuery)
                result.push({ bricol: allDocs[x], countOfBids })
            }
            //return result
            let count = await BricolBtCities.count(query);
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
}