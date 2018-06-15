import Bid from '../../models/bid.model';
import BricolBtCities from '../../models/bricol-bt-cities.model';
import User from '../../models/user.model';
import mongoose from 'mongoose';
import ApiResponse from '../../helpers/ApiResponse';
import ApiError from '../../helpers/ApiError';
import { body, param, validationResult } from 'express-validator/check';


export default {
    //validation for create new bid
    validateBody() {
        let validations = [
            body("cost").exists().withMessage("cost is required"),
            body("user").exists().withMessage("user is required"),
            body('offerDescription').exists().withMessage("offerDescription  is required"),
            body("cost").exists().withMessage("cost is required"),
        ];
        return validations;
    },

    //create new Bid for specific bricol 
    async createNewBid(req, res, next) {
        try {
            const validationErrors = validationResult(req).array();
            if (validationErrors.length > 0)
                return next(new ApiError(422, validationErrors));

            let bricolId = req.params.bricolId;
            req.body.bricol = bricolId;
            req.body.bidType = 'bricol-bt-cities';
            let newBid = await Bid.create(req.body);
            return res.status(201).json(newBid);
        } catch (err) {
            next(err)
        }
    },

    //retrive all bids under one bricole 
    async retriveAllBidsOfOneBricole(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 20;
            const page = req.query.page || 1;
            let bricolId = req.params.bricolId;
            let query = {}
            query.bricol = bricolId;
            query.bidType = 'bricol-bt-cities';

            let allDocs = await Bid.find(query)
                .populate('user')
                .populate('bricol').skip((page - 1) * limit)
                .limit(limit).sort({ creationDate: -1 })
            let count = await Bid.count(query);

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