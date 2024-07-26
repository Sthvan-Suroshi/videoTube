import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const likedAlready = await Like.findOne({
    video: videoId,
    likedBy: req.user?._id,
  });

  if (likedAlready === null) {
    const like = await Like.create({
      video: videoId,
      likedBy: req.user?._id,
    });

    if (!like) {
      throw new ApiError(500, "Something went wrong while creating like");
    }

    res
      .status(200)
      .json(new ApiResponse(200, { likedBy: true }, "Video liked"));
  } else {
    await Like.findByIdAndDelete(likedAlready?._id);
    res
      .status(200)
      .json(new ApiResponse(200, { isLiked: false }, "Video unliked"));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }

  const likedAlready = await Like.findOne({
    comment: commentId,
    likedBy: req.user?._id,
  });

  if (likedAlready) {
    const deletedLike = await Like.findByIdAndDelete(likedAlready?._id);

    if (!deletedLike) {
      throw new ApiError(500, "Something went wrong while deleting like");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, { isLiked: false }, "Comment unliked"));
  }

  const like = await Like.create({
    comment: commentId,
    likedBy: req.user?._id,
  });

  if (!like) {
    throw new ApiError(500, "Something went wrong while creating like");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { likedBy: true }, "Comment liked"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet id");
  }

  const likedAlready = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user?._id,
  });

  if (likedAlready) {
    const deletedLike = await Like.findByIdAndDelete(likedAlready?._id);

    return res
      .status(200)
      .json(new ApiResponse(200, { isLiked: false }, "Tweet unliked"));
  }

  const like = await Like.create({
    tweet: tweetId,
    likedBy: req.user?._id,
  });

  if (!like) {
    throw new ApiError(500, "Something went wrong while creating like");
  }

  res.status(200).json(new ApiResponse(200, { isLiked: true }, "Tweet liked"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const likedVideosAggregate = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "likedVideo",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "ownerDetials",
            },
          },
          {
            $unwind: "$ownerDetials",
          },
        ],
      },
    },
    {
      $unwind: "$likedVideo",
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $project: {
        _id: 0,
        $likedVideo: {
          _id: 1,
          title: 1,
          description: 1,
          thumbnail: 1,
          videoUrl: 1,
          isPublished: 1,
          views: 1,
          duration: 1,
          // createdAt:1,
          $ownerDetails: {
            _id: 1,
            username: 1,
            fullName: 1,
            avatar: 1,
          },
        },
      },
    },
  ]);

  if (!likedVideosAggregate) {
    throw new ApiError(500, "Something went wrong while fetching liked videos");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        likedVideosAggregate,
        "Liked videos fetched successfully"
      )
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
