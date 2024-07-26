import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  // TODO: toggle subscription

  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel id");
  }

  const subscribedAlready = await Subscription.findOne({
    subscriber: req.user?._id,
    channel: channelId,
  });

  try {
    if (subscribedAlready) {
      await Subscription.findByIdAndDelete(subscribedAlready?._id);

      return res
        .status(200)
        .json(new ApiResponse(200, { subscribed: false }, "Unsubscribed"));
    }
  } catch (error) {
    console.log("error unable to perform action at the moment ", error);
  }

  const subscribed = await Subscription.create({
    subscriber: req.user?._id,
    channel: channelId,
  });

  if (!subscribed) {
    throw new ApiError(500, "Something went wrong while subscribing");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { subscribed: true }, "Subscribed successfully")
    );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel id");
  }

  const subscribers = await Subscription.aggregate([
    // Match documents where the channel field matches the given channelId
    { $match: { channel: new mongoose.Types.ObjectId(channelId) } },

    // Lookup subscriber details from the users collection
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriber",
        pipeline: [
          // Lookup subscriptions where the user is the channel
          {
            $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "channel",
              as: "subscribedToSubscriber",
            },
          },
          // Add fields to determine if the subscriber is subscribed back and count their subscribers
          {
            $addFields: {
              subscribedToSubscriber: {
                $in: [channelId, "$subscribedToSubscriber.subscriber"],
              },
              subscribersCount: { $size: "$subscribedToSubscriber" },
            },
          },
        ],
      },
    },

    // Unwind the subscriber array
    { $unwind: "$subscriber" },

    // Project the required fields
    {
      $project: {
        _id: 0,
        subscriber: {
          _id: 1,
          username: 1,
          fullName: 1,
          avatar: 1,
          subscribedToSubscriber: 1,
          subscribersCount: 1,
        },
      },
    },
  ]);

  if (!subscribers) {
    throw new ApiError(404, "Channel not found");
  }

  return res.status(200).json(new ApiResponse(200, subscribers, "OK"));
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber id");
  }

  const subscribedChannels = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },

    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "subscribedChannel",
        pipeline: [
          // Lookup videos for each channel
          {
            $lookup: {
              from: "videos",
              localField: "_id",
              foreignField: "owner",
              as: "videos",
            },
          },
          {
            $addFields: {
              latestVideo: { $last: "$videos" },
            },
          },
        ],
      },
    },
    { $unwind: "$subscribedChannel" },
    {
      $project: {
        _id: 0,
        subscribedChannel: {
          _id: 1,
          username: 1,
          fullName: 1,
          "avatar.url": 1,
          latestVideo: {
            _id: 1,
            "videoFile.url": 1,
            "thumbnail.url": 1,
            owner: 1,
            title: 1,
            description: 1,
            duration: 1,
            createdAt: 1,
            views: 1,
          },
        },
      },
    },
  ]);

  if (!subscribedChannels) {
    throw new ApiError(404, "No channels found");
  }

  return res.status(200).json(new ApiResponse(200, subscribedChannels, "OK"));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
