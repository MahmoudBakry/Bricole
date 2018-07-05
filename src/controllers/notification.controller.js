import NotificationModel from '../models/notification.model'
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator/check';
import ApiError from '../helpers/ApiError'
import ApiResponse from '../helpers/ApiResponse'

export default {
    //retrive all notification of one customer
    async retriveAllNotification(req, res, next) {
        try {
            let userId = req.params.userId;

            

            return res.status(200).send('work good')
        } catch (err) {
            next(err)
        }
    },
}