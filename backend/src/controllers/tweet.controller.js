import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";

const createTweet = asyncHandler(async (req, res) => {
  const { tweet } = req.body;

  if (tweet.trim().length === 0) {
    throw new ApiError(400, "Empty tweet is not allowed");
  }

  const createdTweet = await Tweet.create({
    content: tweet,
    owner: req.user?._id,
  });

  if (!createdTweet) {
    throw new ApiError(500, "Something went wrong while creating tweet");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdTweet, "Tweet created successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet id");
  }

  if (content.trim().length === 0) {
    throw new ApiError(400, "Empty tweet is not allowed");
  }

  //check if the tweet belongs to the user

  const tweet = await Tweet.findById(tweetId);

  if (tweet?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "You are not allowed to update this tweet");
  }

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        content,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedTweet) {
    throw new ApiError(
      500,
      "Something went wrong while updating tweet!. Try again later"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet

  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet id");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiResponse(400, "tweet not found");
  }

  if (tweet?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "You are not allowed to delete this tweet");
  }

  const deleteTweetLikes = await Like.deleteMany({
    tweet: tweetId,
  });

  if (!deleteTweetLikes) {
    throw new ApiError(500, "Something went wrong while deleting tweet likes");
  }

  const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

  if (!deletedTweet) {
    throw new ApiError(
      500,
      "Something went wrong while deleting tweet!. Try again later"
    );
  }

  console.log("deleted tweet", tweetId);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet deleted successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets

  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  const userTweets = await Tweet.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
        pipeline: [
          {
            $project: {
              // username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "tweet",
        as: "likeDetails",
        pipeline: [
          {
            $project: {
              likedBy: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        likeCount: { $size: "$likeDetails" },
        ownerDetails: { $arrayElemAt: ["$ownerDetails", 0] },
        isLiked: {
          $in: [
            new mongoose.Types.ObjectId(req.user?._id),
            "$likeDetails.likedBy",
          ],
        },
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $project: {
        content: 1,
        createdAt: 1,
        ownerDetails: 1,
        likeCount: 1,
        isLiked: 1,
      },
    },
  ]);

  if (!userTweets) {
    throw new ApiError(500, "Something went wrong while fetching tweets");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, userTweets, "Tweets fetched"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
