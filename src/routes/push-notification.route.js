import express from "express";
import PushController from "../controllers/push-notifications.controller" ;
import passport from "passport";

const requireAuth = passport.authenticate('jwt', { session: false });

const router = express.Router();

router.post("/push-subscribe",requireAuth,PushController.subscribe) ;
router.post("/push-unsubscribe",requireAuth,PushController.unsubscribe) ;
router.post("/push-update",requireAuth,PushController.update) ;



export default router;
