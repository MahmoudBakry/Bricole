import Bid from '../models/bid.model';
import Bricol from '../models/bricole.model';
import User from '../models/user.model';
import History from '../models/history.model';
import Notification from '../models/notification.model';

import mongoose from 'mongoose';
import ApiResponse from '../helpers/ApiResponse';
import ApiError from '../helpers/ApiError';
import { body, param, validationResult } from 'express-validator/check';
import { send } from '../services/push-notifications';
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

            let bricolDetails = await Bricol.findById(req.params.bricolId);
            if (!bricolDetails)
                return res.status(404).end();

            let query = {
                user: req.body.user,
                bricol: req.params.bricolId,
                bidType: 'bricol'
            }
            let bidExist = await Bid.findOne(query);
            if (bidExist) {
                console.log(bidExist)
                return next(new ApiError(400, 'لا يمكنك إضافة عرضين لنفس الخدمة'));
            }
            //in app notification 
            let newNoti = await Notification.create({
                targetUser: bricolDetails.user,
                subjectType: 'bricol',
                subject: req.params.bricolId,
                text: 'لديك عرض جديد على خدمتك',
            });

            //send notifications
            let title = "لديك عرض جديد على خدمتك";
            let body = "أضاف أحد مزودي الخدمات عرضًا جديدًا لخدمتك ،خذ جولة واقرأ هذا العرض"
            send(bricolDetails.user, title, body)

            let bricolId = req.params.bricolId;
            req.body.bricol = bricolId;
            req.body.bidType = 'bricol';
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
            let query = {}
            query.bricol = bricolId;
            query.bidType = 'bricol';
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

    //count number of bids to specific bricol
    async countNumberOfBidToONeBricol(req, res, next) {
        try {
            let bricolId = req.params.bricolId;
            let query = {};
            query.bricol = bricolId;
            query.bidType = 'bricol'
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
        console.log(req.user._id)
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
        //  update bricol details 
        bricolDetails.status = "assigned";
        bricolDetails.bricoler = bidDetails.user;
        await bricolDetails.save();
        console.log(bricolDetails.bricoler)
        //update bid 
        bidDetails.status = 'accepted';
        await bidDetails.save();

        //update bricole history 
        let historyQuery = {
            serviceType: 'bricol',
            service: bricolDetails.id,
            user: bricolDetails.user,
        }
        let historyDoc = await History.findOne(historyQuery);
        console.log(historyDoc)
        historyDoc.status = "assigned";
        historyDoc.bricoler = bidDetails.user;
        await historyDoc.save();
        console.log(await History.findOne(historyQuery));

        //in app notification 
        let newNoti = await Notification.create({
            targetUser: bidDetails.user,
            subjectType: 'bid',
            subject: bidDetails.id,
            text: 'تم قبول عرضك من مالك الخدمة',
        });

        //send notifications
        let title = "تم قبول عرضك";
        let body = "تم قبول عرضك من مالك الخدمة،اعمل بجد لكسب الثقة من الجميع"
        send(bidDetails.user, title, body)

        //return result
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

        //update bricole history 
        let historyQuery = {
            serviceType: 'bricol',
            service: bricolDetails.id,
            user: bricolDetails.user,
        }
        let historyDoc = await History.findOne(historyQuery);
        console.log(historyDoc)
        historyDoc.status = "inProgress";
        await historyDoc.save();

        //return responce 
        return res.status(204).end();

    },

}


