import User from '../../models/user.model';
import mongoose from 'mongoose';
import ApiResponse from '../../helpers/ApiResponse';
import ApiError from '../../helpers/ApiError';


export default {
    //add one bricoler to user favourite list
    async addFavouriteToMyList(req, res, next) {
        try {
            if (!req.body.bricolerId)
                return next(new ApiError(422, 'bricoler Id is required'));
            let bricolerDetails = await User.findById(req.body.bricolerId)

            if (!bricolerDetails)
                return res.status(404).end();

            let userId = req.params.userId;
            let userDetails = await User.findById(userId);

            if (!userDetails)
                return res.status(404).end();

            let bricolerIds = userDetails.favouritArray;
            let bricolerId = req.body.bricolerId;

            //check if this bricoler in my list or not 
            if (bricolerIds.includes(bricolerId))
                return next(new ApiError(422, 'You have added this bricoler in your favourite list before'))

            //if not found 
            userDetails.favouritArray.push(bricolerId);
            await userDetails.save();

            let newUser = await User.findById(userId);
            console.log(newUser.favouritArray)
            return res.status(204).end();

        } catch (err) {
            next(err)
        }
    },
    //retrive all favourite bricolers of one user 
    async retriveAllFavouriteBricolersOfOneUser(req, res, next) {
        try {

            const limit = parseInt(req.query.limit) || 20;
            const page = req.query.page || 1;

            let userId = req.params.userId;
            let userDetails = await User.findById(userId);
            if (!userDetails)
                return res.status(404).end();

            let bricolerArray = userDetails.favouritArray;
            let arrayLength = bricolerArray.length;
            let result = [];
            for (let x = 0; x < arrayLength; x++) {
                let userDoc = await User.findById(bricolerArray[x])
                    .populate('job')
                    .populate('city')
                result.push(userDoc);
            }

            let count = arrayLength;
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