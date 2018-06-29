import Bid from '../../models/bid.model';
import BricolBtCities from '../../models/bricol-bt-cities.model';
import User from '../../models/user.model';
import History from '../../models/history.model';
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
            let query = {
                user: req.body.user,
                bricol: req.params.bricolId,
                bidType: 'bricol-bt-cities'
            }
            let bidExist = await Bid.findOne(query);
            if (bidExist) {
                console.log(bidExist)
                return next(new ApiError(400, 'لا يمكنك إضافة عرضين لنفس الخدمة'));
            }


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

    //acceppt bid 
    async accepptBid(req, res, next) {
        let bidId = req.params.bidId;
        let bricolId = req.params.bricolId;

        let bidDetails = await Bid.findById(bidId);
        if (!bidDetails)
            return next(new ApiError(404));

        let bricolDetails = await BricolBtCities.findById(bricolId);
        if (!bricolDetails)
            return next(new ApiError(404));

        let userId = req.user._id;
        if (!(userId == bricolDetails.user))
            return next(new ApiError(403, 'not access to this resource'))
        //update bricol details 
        bricolDetails.status = "assigned";
        bricolDetails.bricoler = bidDetails.user;
        await bricolDetails.save();
        console.log(bricolDetails.bricoler)
        //update bid 
        bidDetails.status = 'accepted';
        await bidDetails.save();

        //update bricole history 
        let historyQuery = {
            serviceType: 'bricol-bt-cities',
            service: bricolDetails.id,
            user: bricolDetails.user,
        }
        let historyDoc = await History.findOne(historyQuery);
        console.log(historyDoc)
        historyDoc.status = "assigned";
        historyDoc.bricoler = bidDetails.user;
        await historyDoc.save();
        console.log(await History.findOne(historyQuery));

        //return result
        return res.status(204).end();

    },

    //make bricole in progress  
    async makeBricolInProgress(req, res, next) {
        let bidId = req.params.bidId;
        let bricolId = req.params.bricolId;

        let bidDetails = await Bid.findById(bidId);
        if (!bidDetails)
            return next(new ApiError(404));

        let bricolDetails = await BricolBtCities.findById(bricolId);
        if (!bricolDetails)
            return next(new ApiError(404));

        let userId = req.user._id;
        if (!(userId == bricolDetails.user))
            return next(new ApiError(403, 'not access to this resource'))

        //update bricol details 
        bricolDetails.status = "inProgress";
        await bricolDetails.save();
        console.log(bricolDetails.bricoler)

        //update bricole history 
        let historyQuery = {
            serviceType: 'bricol-bt-cities',
            service: bricolDetails.id,
            user: bricolDetails.user,
        }
        let historyDoc = await History.findOne(historyQuery);
        console.log(historyDoc)
        historyDoc.status = "inProgress";
        historyDoc.bricoler = bidDetails.user;
        await historyDoc.save();
        console.log(await History.findOne(historyQuery));

        //return result
        return res.status(204).end();

    },


}