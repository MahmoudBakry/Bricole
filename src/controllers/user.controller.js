import User from "../models/user.model";
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
        let user = req.user; // Passport
        console.log(user.type)
        let userDetails = await User.findById(user.id)
            .populate('city')
            .populate('jobs')
        res.send({ userDetails, token: generateToken(user.id) });
    },


}