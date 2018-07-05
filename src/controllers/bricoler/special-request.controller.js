import User from '../../models/user.model';
import SpecialRequest from '../../models/special-request.model';
import History from '../../models/history.model';
import Notification from '../../models/notification.model';

import mongoose from 'mongoose';
import ApiResponse from '../../helpers/ApiResponse';
import ApiError from '../../helpers/ApiError';
import { body, param, validationResult } from 'express-validator/check';
import { escapeRegExp } from 'lodash';
import * as _ from 'lodash';
import { toImgUrl } from '../../utils/index'

export default {

    //validation for create new request
    validateBody(isUpdate = false) {
        let validations = [
            body("title").exists().withMessage("title is required"),
            body("description").exists().withMessage("descripption is required"),
            body('lang').exists().withMessage("lang  is required"),
            body("lat").exists().withMessage("lat is required"),
            body("dueDate").exists().withMessage("dueDate is required")
        ];
        return validations;
    },

    async createNewSpecialRequest(req, res, next) {
        try {
            const validationErrors = validationResult(req).array();
            if (validationErrors.length > 0)
                return next(new ApiError(422, validationErrors));


            let bricolerId = req.params.bricolerId;
            //prepare data 
            if (req.files.length > 0) {
                req.body.imgs = []
                for (let x = 0; x < req.files.length; x++) {
                    req.body.imgs.push(await toImgUrl(req.files[x]))
                }
            }
            let lang = req.body.lang;   //long
            let lat = req.body.lat;//lat
            let requestLocation = [lang, lat] //modify location 
            req.body.location = requestLocation;
            req.body.dueDate = parseInt(req.body.dueDate)
            req.body.user = req.user.id;
            req.body.bricoler = bricolerId;

            //create new doc 
            let newDoc = await SpecialRequest.create(req.body);
            let createdDoc = await SpecialRequest.findById(newDoc.id)
                .populate('user')
                .populate('bricoler')

            //create history doc 
            let historyObject = {
                serviceType: 'special-request',
                service: createdDoc.id,
                user: createdDoc.user,
                bricoler: createdDoc.bricoler,
                status: 'pendding'
            }
            let historyDoc = await History.create(historyObject);


            //in app notification 
            let newNoti = await Notification.create({
                targetUser: createdDoc.bricoler,
                subjectType: 'special-request',
                subject: createdDoc.id,
                text: 'يطلب منك أحد العملاء خدمة جديدة',
            });

            //send notifications
            let title = "يطلب منك أحد العملاء خدمة جديدة";
            let body = "يطلب منك أحد العملاء خدمة جديدة, يرجى التحقق من ذلك والعمل بجد للفوز"
            send(createdDoc.bricoler, title, body)

            return res.status(201).json(createdDoc);

        } catch (err) {
            next(err)
        }
    },

    //retrive one request 
    async retriveOneRequestDetails(req, res, next) {
        try {
            let bricolerId = req.params.bricolerId;
            let bricolerDetails = await User.findById(bricolerId);
            if (!bricolerDetails)
                res.status(404).end();
            let requestId = req.params.requestId;
            let requestDetails = await SpecialRequest.findById(requestId)
                .populate('user')
                .populate('bricoler')
            if (!requestDetails)
                return res.status(404).end()
            return res.status(200).json(requestDetails);
        } catch (err) {
            next(err)
        }
    },

    //accept request by bricoler 
    async acceptRequest(req, res, next) {
        try {

            let bricolerId = req.params.bricolerId;
            let bricolerDetails = await User.findById(bricolerId);
            if (!bricolerDetails)
                res.status(404).end();

            let requestId = req.params.requestId;
            let requestDetails = await SpecialRequest.findById(requestId)
            if (!requestDetails)
                return res.status(404).end();

            if (!(req.user.id == requestDetails.bricoler))
                next(new ApiError(403, 'must bricoler only can accept it'));

            requestDetails.status = "accepted";
            await requestDetails.save();

            let newDoc = await SpecialRequest.findById(requestDetails.id)
                .populate('user')
                .populate('bricoler')

            //update bricole history 
            let historyQuery = {
                serviceType: 'special-request',
                service: requestDetails.id,
                user: requestDetails.user,
                bricoler: requestDetails.bricoler
            }
            let historyDoc = await History.findOne(historyQuery);
            console.log(historyDoc)
            historyDoc.status = "accepted";
            await historyDoc.save();

            //in app notification 
            let newNoti = await Notification.create({
                targetUser: newDoc.user,
                subjectType: 'special-request',
                subject: newDoc.id,
                text: 'تم قبول طلبك من مزود الخدمة',
            });

            //send notifications
            let title = "تم قبول طلبك من مزود الخدمة";
            let body = "تم قبول طلبك من مزود الخدمة, يرجى أن تكون متصلا به دائما"
            send(newDoc.user, title, body)

            //return responce 
            return res.status(200).json(newDoc);

        } catch (err) {
            next(err)
        }
    },
    //ignore request by bricoler 
    async ignoreRequst(req, res, next) {
        try {

            let bricolerId = req.params.bricolerId;
            let bricolerDetails = await User.findById(bricolerId);
            if (!bricolerDetails)
                res.status(404).end();

            let requestId = req.params.requestId;
            let requestDetails = await SpecialRequest.findById(requestId)
            if (!requestDetails)
                return res.status(404).end();

            if (!(req.user.id == requestDetails.bricoler))
                next(new ApiError(403, 'must bricoler only can ignored it'));

            requestDetails.status = "ignored";
            await requestDetails.save();

            let newDoc = await SpecialRequest.findById(requestDetails.id)
                .populate('user')
                .populate('bricoler')

            //update bricole history
            console.log(requestDetails.id)
            console.log(requestDetails.user)
            console.log(requestDetails.bricoler)
            let historyQuery = {
                serviceType: 'special-request',
                service: requestDetails.id,
                user: requestDetails.user,
                bricoler: requestDetails.bricoler
            }
            let historyDoc = await History.findOne(historyQuery);
            console.log(historyDoc)
            historyDoc.status = "ignored";
            await historyDoc.save();
            //return responce 

            //in app notification 
            let newNoti = await Notification.create({
                targetUser: newDoc.user,
                subjectType: 'special-request',
                subject: newDoc.id,
                text: 'نحن نأسف لرفض طلبك من مزود الخدمة',
            });

            //send notifications
            let title = "نحن نأسف لرفض طلبك من مزود الخدمة";
            let body = "نحن نأسف لرفض طلبك من مزود الخدمة , يمكن أن يكون مشغولاً الآن ولا يمكنه مساعدتك"
            send(newDoc.user, title, body)

            return res.status(200).json(newDoc);

        } catch (err) {
            next(err)
        }
    }
}


