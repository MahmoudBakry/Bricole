import Bid from '../models/bid.model';
import Bricol from '../models/bricole.model';
import User from '../models/user.model';
import mongoose from 'mongoose';
import ApiResponse from '../helpers/ApiResponse';
import ApiError from '../helpers/ApiError';
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
            let newBid = await Bid.create(req.body);
            return res.status(201).json(newBid);
        } catch (err) {
            next(err)
        }
    },

    //retrive all Bid for one Bricol 
    async retriveAllBidsForBricol(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 20;
            const page = req.query.page || 1;
            let bricolId = req.params.bricolId;
            let allDocs = await Bid.find({ bricol: bricolId })
                .populate('user')
                .populate('bricol').skip((page - 1) * limit)
                .limit(limit).sort({ creationDate: -1 })
            let count = await Bid.count({ bricol: bricolId });

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

    //count number of bids to specific bricol
    async countNumberOfBidToONeBricol(req, res, next) {
        try {
            let bricolId = req.params.bricolId;
            let bricolDetails = await Bricol.findById(bricolId);
            if (!bricolDetails)
                return res.status(404).end();
            let count = await Bid.count({ bricol: bricolId })
            return res.status(200).json({ count });
        } catch (err) {
            next(err)
        }
    },

    //retrive Bid Details 
    async bidDetails(req, res, next) {
        try {
            let bidId = req.params.bidId;
            let bidDetails = await Bid.findById(bidId)
                .populate('user')
                .populate('bricol')
            if (!bidDetails)
                return next(new ApiError(404));
            console.log(bidDetails)
            return res.status(200).json(bidDetails)
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

        let bricolDetails = await Bricol.findById(bricolId);
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

        return res.status(204).end();

    },


    //refuse bid 
    async refuseBid(req, res, next) {
        let bidId = req.params.bidId;
        let bricolId = req.params.bricolId;

        let bidDetails = await Bid.findById(bidId);
        if (!bidDetails)
            return next(new ApiError(404));

        let bricolDetails = await Bricol.findById(bricolId);
        if (!bricolDetails)
            return next(new ApiError(404));

        let userId = req.user._id;
        if (!(userId == bricolDetails.user))
            return next(new ApiError(403, 'not access to this resource'))
        //update bid 
        bidDetails.status = 'refused';
        await bidDetails.save();

        return res.status(204).end();

    },


    //make bricole in progress  
    async makeBricolInProgress(req, res, next) {
        let bidId = req.params.bidId;
        let bricolId = req.params.bricolId;

        let bidDetails = await Bid.findById(bidId);
        if (!bidDetails)
            return next(new ApiError(404));

        let bricolDetails = await Bricol.findById(bricolId);
        if (!bricolDetails)
            return next(new ApiError(404));


        let userId = req.user._id;
        console.log(typeof (userId))
        if (!(userId == bricolDetails.bricoler))
            return next(new ApiError(403, 'not access to this resource'))
        //update bricole by bricoler  
        bricolDetails.status = 'inProgress';
        await bricolDetails.save();

        return res.status(204).end();

    },

}


