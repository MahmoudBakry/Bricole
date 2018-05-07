import JOb from '../models/job.model';
import mongoose from 'mongoose';
import ApiResponse from '../helpers/ApiResponse';
import ApiError from '../helpers/ApiError';

export default {
    async createJob(req, res,next){
        try {
            let newJob = await JOb.create(req.body);
            return res.status(201).json(newJob);
        } catch (err) {
            next(err)
        }
    },

    //retrive all jobs 
    async allJobs(req, res,next){
        try {
            let allDocs = await JOb.find();
            return res.status(200).json(allDocs);
        } catch (err) {
            next(err)
        }
    },
    
}


