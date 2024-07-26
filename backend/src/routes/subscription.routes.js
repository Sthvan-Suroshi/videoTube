import { Router } from "express";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
  .route("/c/:channelId")
  .get(getUserChannelSubscribers)
  //gives data about your subscribers
  .post(toggleSubscription);
//subsribers and unsubsribes channel

router.route("/u/:subscriberId").get(getSubscribedChannels);
//gives data about channel user has subscribed

export default router;
