import User from '../../models/user.model';
import Bricol from '../../models/bricole.model';
import BricolBtCity from '../../models/bricol-bt-cities.model';
import Bid from '../../models/bid.model';

import ApiError from '../../helpers/ApiError';
import ApiResponse from '../../helpers/ApiResponse';

export default {

    //retrive some statistics 
    async retriveSomeNumbers(req, res, next) {
        try {
            if (req.user.type !== "ADMIN")
                return next(new ApiError(403, 'Not Admin User'))
            //logic 
            let numberOfUsers = await User.count();
            let numberOfBricolsInCity = await Bricol.count();
            let numberOfBricolsBtCity = await BricolBtCity.count();
            let numberOfBidInCity = await Bid.count({ bidType: 'bricol' });
            let numberOfBidBetweenCity = await Bid.count({ bidType: 'bricol-bt-cities' });

            return res.status(200).json({
                numberOfUsers,
                numberOfBricolsInCity,
                numberOfBricolsBtCity,
                numberOfBidInCity,
                numberOfBidBetweenCity
            })

        } catch (err) {
            next(err)
        }
    },

    //fetch all users 
    async retriveAllUsers(req, res, next) {
        try {
            if (req.user.type !== "ADMIN")
                return next(new ApiError(403, 'Not Admin User'))

            let allDocs = await User.find()
                .populate('jobs')
                .populate('city')
                .sort({ creationDate: -1 })
            return res.status(200).json(allDocs)
        } catch (err) {
            next(err)
        }
    },

    //rertive all bricols 
    async fechAllBricols(req, res, next) {
        try {
            let allDocs = await Bricol.find()
                .populate('user')
                .populate('bricoler')
                .populate('job').sort({ creationDate: -1 })
            return res.status(200).json(allDocs);
        } catch (err) {
            next(err)
        }
    },

    //rertive all bricols 
    async fechAllBricolsBtCity(req, res, next) {
        try {
            let allDocs = await BricolBtCity.find()
                .populate('user')
                .populate('bricoler')
                .populate('job').sort({ creationDate: -1 })
            return res.status(200).json(allDocs);
        } catch (err) {
            next(err)
        }
    },

    //retrive all users that have complete profile 
    async fetchCompleteProfileUsers(req, res, next) {
        try {
            let allDocs = await User.find({ completed: true })
                .populate('jobs')
                .populate('city')
                .sort({ creationDate: -1 })
            return res.status(200).json(allDocs);
        } catch (err) {
            next(err)
        }
    },

}