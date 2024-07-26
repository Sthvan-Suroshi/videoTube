import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

  const userId = req.user?._id;

  const totalSubscribers = await Subscription.countDocuments({
    channel: new mongoose.Types.ObjectId(req.user?._id),
  });

  console.log("total subscribers ", totalSubscribers);

  // if (!totalSubscribers) {
  //   throw new ApiError(400, "Cannot fetch subscribers");
  // }

  const videoStats = await Video.aggregate([
    // 1. Match videos by the owner ID
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    // 2. Lookup likes for each video
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    // 3. Group by null to accumulate totals
    {
      $group: {
        _id: null,
        totalLikes: { $sum: { $size: "$likes" } }, // Sum the size of likes array for each video
        totalViews: { $sum: "$views" }, // Sum the views for each video
        totalVideos: { $sum: 1 }, // Count the number of videos
      },
    },
    // 4. Project the final results
    {
      $project: {
        _id: 0,
        totalLikes: 1,
        totalViews: 1,
        totalVideos: 1,
      },
    },
  ]);

  if (!videoStats) {
    throw new ApiError(400, "Cannot fetch video stats");
  }

  const channelStats = {
    totalSubscribers: totalSubscribers[0]?.subscribersCount || 0,
    totalLikes: videoStats[0]?.totalLikes || 0,
    totalViews: videoStats[0]?.totalViews || 0,
    totalVideos: videoStats[0]?.totalVideos || 0,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, channelStats, "Fetched channel stats"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const userId = req.user?._id;

  const videos = await Video.aggregate([
    // 1. Match videos by the owner ID
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    // 2. Lookup likes for each video and add likesCount field
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    // 3. Add fields for createdAt parts and likesCount
    {
      $addFields: {
        createdAt: {
          $dateToParts: { date: "$createdAt" },
        },
        likesCount: {
          $size: "$likes",
        },
      },
    },
    // 4. Sort by createdAt in descending order
    {
      $sort: {
        "createdAt.year": -1,
        "createdAt.month": -1,
        "createdAt.day": -1,
      },
    },
    // 5. Project the required fields
    {
      $project: {
        _id: 1,
        "videoFile.url": 1,
        "thumbnail.url": 1,
        title: 1,
        description: 1,
        createdAt: {
          year: "$createdAt.year",
          month: "$createdAt.month",
          day: "$createdAt.day",
        },
        isPublished: 1,
        likesCount: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "channel video fetched successfully"));
});

export { getChannelStats, getChannelVideos };
