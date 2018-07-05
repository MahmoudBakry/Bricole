import User from '../../models/user.model';
import mongoose from 'mongoose';
import ApiResponse from '../../helpers/ApiResponse';
import ApiError from '../../helpers/ApiError';




let deg2rad = (deg) => {
    return deg * (Math.PI / 180)
}
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

            //1 - calculate distance between user and bricoler
            let userLocation = req.user.location;
            let finalResult = []
            for (let x = 0; x < result.length; x++) {
                let bricolerLocationToDistance = result[x].location;

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
                finalResult.push({ bricol: result[x], distanceInKm: d })
            }

            let count = arrayLength;
            return res.send(new ApiResponse(
                finalResult,
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