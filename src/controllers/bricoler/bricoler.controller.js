import User from '../../models/user.model';
import SpecialRequest from '../../models/special-request.model';
import mongoose from 'mongoose';
import ApiResponse from '../../helpers/ApiResponse';
import ApiError from '../../helpers/ApiError';
import { body, param, validationResult } from 'express-validator/check';
import { escapeRegExp } from 'lodash';
import * as _ from 'lodash';



let deg2rad = (deg) => {
    return deg * (Math.PI / 180)
}

export default {
    //retrive all user that have complete profile 
    async fetchAllBricoler(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 200;
            const page = req.query.page || 1;
            let { jobs, gender } = req.query
            let query = {};
            //filter by gender
            if (gender)
                query.gender = gender;
            //search by word in about of bricoler (user)
            if (req.query.q) {
                const matchQueryRegx = new RegExp(escapeRegExp(req.query.q), 'i')
                query.about = matchQueryRegx;
            }
            query.completed = true

            let allDocs = await User.find(query)
                .populate('city')
                .populate('jobs')
                .skip((page - 1) * limit)
                .limit(limit).sort({ creationDate: -1 })

            //1 - calculate distance between user and bricoler
            let userLocation = req.user.location;
            let result = []
            for (let x = 0; x < allDocs.length; x++) {
                let bricolerLocationToDistance = allDocs[x].location;

                //first locattion point
                let lang1 = parseFloat(bricolerLocationToDistance[0]);
                let lat1 = parseFloat(bricolerLocationToDistance[1]);
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
                result.push({ bricol: allDocs[x], distanceInKm: d })
            }




            let count = await User.count(query);
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

    //fetch all requests for specific bricoler 
    async fetchRequestOfOneBricoler(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 200;
            const page = req.query.page || 1;
            let bricolerId = req.params.bricolerId;

            let bricolerDetails = await User.findById(bricolerId);
            if (!bricolerDetails)
                return res.status(404).end();
            let query = {}
            query.bricoler = bricolerId;
            let allDocs = await SpecialRequest.find(query)
                .populate('user')
                .populate('bricoler')
                .skip((page - 1) * limit)
                .limit(limit).sort({creationDate : -1})

            let count = await SpecialRequest.count(query);
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