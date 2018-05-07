import express from 'express';
import JObController from '../controllers/job.controller'
const router = express.Router();

router.route('/')
    .post(JObController.createJob)
    .get(JObController.allJobs)
export default router;