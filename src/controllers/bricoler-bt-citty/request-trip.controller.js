import TripBtCity from '../../models/trip-bt-ciy.model';
import User from '../../models/user.model';
import RequestTripBtCity from '../../models/request-bricoler-bt-city.model';
import mongoose from 'mongoose';
import ApiResponse from '../../helpers/ApiResponse';
import ApiError from '../../helpers/ApiError';
import { body, param, validationResult } from 'express-validator/check';
import { toImgUrl } from '../../utils/index'
import { escapeRegExp } from 'lodash';
import { send } from '../../services/push-notifications';

export default {
    async createNewRequest(req, res, next) {
        try {
            let tripId = req.params.tripId;
            let tripDetails = await TripBtCity.findById(tripId);
            if (!tripDetails)
                return res.status(404).end();
            //prepare data 
            req.body.trip = tripId;
            req.body.user = req.user._id;
            //data base query
            let newDoc = await RequestTripBtCity.create(req.body);

            return res.status(201).json(newDoc);

        } catch (err) {
            next(err)
        }
    },
    //retrive all request under one trip 
    async retriveAllRequestUnderOneTrip(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 20;
            const page = req.query.page || 1;

            let tripId = req.params.tripId;
            let tripDetails = await TripBtCity.findById(tripId);
            if (!tripDetails)
                return res.status(404).end();

            let query = {}
            query.trip = tripId;

            let allDocs = await RequestTripBtCity.find(query)
                .populate('trip')
                .populate('user')
                .skip((page - 1) * limit)
                .limit(limit).sort({ creationDate: -1 })

            //return responce 
            let count = await RequestTripBtCity.count(query);
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

    //retrive one Request 
    async retriveOneRequest(req, res, next) {
        try {
            let tripId = req.params.tripId;
            let tripDetails = await TripBtCity.findById(tripId);
            if (!tripDetails)
                return res.status(404).end();

            let requestId = req.params.requestId;
            let requestDetails = await RequestTripBtCity.findById(requestId)
                .populate('trip')
                .populate('user')

            return res.status(200).json(requestDetails);

        } catch (err) {
            next(err)
        }
    },

    //accept request 
    async acceptRequest(req, res, next) {
        try {
            let tripId = req.params.tripId;
            let tripDetails = await TripBtCity.findById(tripId);
            if (!tripDetails)
                return res.status(404).end();

            let requestId = req.params.requestId;
            let requestDetails = await RequestTripBtCity.findById(requestId)
            if (!requestDetails)
                return res.status(404).end();

            //update status
            requestDetails.status = 'accept';
            await requestDetails.save();

            //responce
            let newDoc = await RequestTripBtCity.findById(requestDetails.id);
            return res.status(200).json(newDoc)

        } catch (err) {
            next(err)
        }
    },
    //ignore request 
    async ignoreRequest(req, res, next) {
        try {
            let tripId = req.params.tripId;
            let tripDetails = await TripBtCity.findById(tripId);
            if (!tripDetails)
                return res.status(404).end();

            let requestId = req.params.requestId;
            let requestDetails = await RequestTripBtCity.findById(requestId)
            if (!requestDetails)
                return res.status(404).end();

            //update status
            requestDetails.status = 'ignore';
            await requestDetails.save();

            //responce
            let newDoc = await RequestTripBtCity.findById(requestDetails.id);
            return res.status(200).json(newDoc)

        } catch (err) {
            next(err)
        }
    }
}