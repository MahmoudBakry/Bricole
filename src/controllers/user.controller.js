import User from "../models/user.model";
import Bricol from '../models/bricole.model';
import Bid from '../models/bid.model';
import jwt from "jsonwebtoken";
import config from "../config";
import { body, validationResult } from 'express-validator/check';
import mongoose, { Schema } from "mongoose";
import ApiError from '../helpers/ApiError'
import { multerSaveTo } from '../services/multer'
import { toImgUrl } from '../utils/index'
import ApiResponse from '../helpers/ApiResponse'


const { jwtSecret } = config;
const generateToken = id => {

    return jwt.sign({
        sub: id,
        iss: 'App',
        iat: new Date().getTime(),
    }, jwtSecret, { expiresIn: '10000s' })
}


//function check phone regular exression 
//this function support 
// +XX-XXXX-XXXX  
// +XX.XXXX.XXXX  
// +XX XXXX XXXX 
const checkPhone = inputtxt => {
    var phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (inputtxt.match(phoneno)) {
        return true;
    }
    else {
        throw new Error("invalid phone")
    }
}
export default {
    validateBody(isUpdate = false) {
        return [
            body("userName").exists().withMessage("userName is required"),
            body("jobs").exists().withMessage("jobs is required"),
            body("lang").exists().withMessage("lang is required"),
            body("lat").exists().withMessage("lat is required"),
            body("vehicleToWork").exists().withMessage("vehicleToWork is required"),
            body("firstName").exists().withMessage("firstName is required"),
            body("lastName").exists().withMessage("lastName is required"),
            body("city").exists().withMessage("city is required"),
            body("password").exists().withMessage("password is required"),
            body("phone").exists().withMessage("phone is requires")
                //make custome validation to phone to check on phone[unique, isPhone]
                .custom(async (value, { req }) => {
                    //call phone checking pattren function 
                    checkPhone(value);
                    if (isUpdate && req.user.phone == value)
                        userQuery._id = { $ne: req.user._id };
                    let userPhoneQuery = { phone: value };
                    let user = await User.findOne(userPhoneQuery);
                    if (user)
                        throw new Error('phone already exists');
                    else
                        return true
                })
        ];
    },
    //signup logic 
    async signUp(req, res, next) {
        const validationErrors = validationResult(req).array();
        if (validationErrors.length > 0)
            return next(new ApiError(422, validationErrors));
        try {
            if (req.file) {
                req.body.img = await toImgUrl(req.file)
            }
            let lang = req.body.lang;   //long
            let lat = req.body.lat;//lat
            let userLocation = [lang, lat] //modify location 
            req.body.location = userLocation;

            req.body.birthDate = parseInt(req.body.birthDate)
            let createdUser = await User.create(req.body);
            let newUser = await User.findById(createdUser.id)
                .populate('city')
                .populate('jobs')
            res.status(201).send({ user: newUser, token: generateToken(createdUser.id) });
        } catch (err) {
            next(err);
        }
    },
    //sign in logic 
    async signin(req, res, next) {
        let userDetails = req.user; // Passport
        console.log(userDetails.type)
        let user = await User.findById(userDetails.id)
            .populate('city')
            .populate('jobs')
        res.send({ user, token: generateToken(userDetails.id) });
    },

    //retrive all bricols under one user 
    async fetchAllBricolOfOneUser(req, res, next) {
        try {
            console.log('s')
            const limit = parseInt(req.query.limit) || 20;
            const page = req.query.page || 1;

            let userId = req.params.userId
            let query = {}
            if (req.query.status)
                query.status = req.query.status
            query.user = userId
            let allBricols = await Bricol.find(query)
                .populate('user')
                .populate('job')
                .populate('bricoler')
                .skip((page - 1) * limit)
                .limit(limit).sort({ creationDate: -1 })

            let result = []
            for (let x = 0; x < allBricols.length; x++) {
                let query = {}
                query.bricol = allBricols[x].id;
                query.bidType = 'inCity'
                let countBids = await Bid.count(query);
                result.push({ bricol: allBricols[x], countBids: countBids })
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

    //retrive all bricols under one bricoler 
    async fetchAllBricolOfOneBricoler(req, res, next) {
        try {
            console.log('s')
            const limit = parseInt(req.query.limit) || 20;
            const page = req.query.page || 1;

            let bricolerId = req.params.bricolerId
            let query = {}
            if (req.query.status)
                query.status = req.query.status
            query.bricoler = bricolerId
            let allBricols = await Bricol.find(query)
                .populate('user')
                .populate('job')
                .populate('bricoler')
                .skip((page - 1) * limit)
                .limit(limit).sort({ creationDate: -1 })

            let result = []
            for (let x = 0; x < allBricols.length; x++) {
                let query = {}
                query.bricol = allBricols[x].id;
                query.bidType = 'inCity'
                let countBids = await Bid.count(query);
                result.push({ bricol: allBricols[x], countBids: countBids })
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



}