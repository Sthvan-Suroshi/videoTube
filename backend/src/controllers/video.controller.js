import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";

const getAllVideos = asyncHandler(async (req, res) => {
  //TODO: get all videos based on query, sort, pagination

  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  const pipeline = [];

  if (!userId) {
    throw new ApiError(400, "User Id not provided");
  }

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid User Id");
  }

  if (userId) {
    pipeline.push({
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    });
  }
  if (query) {
    pipeline.push({
      $match: {
        title: {
          $regex: query,
          $options: options,
        },
      },
    });
  }

  // fetch videos only that are set isPublished as true
  pipeline.push({ $match: { isPublished: true } });

  //sortBy can be views, createdAt, duration
  //sortType can be ascending(-1) or descending(1)
  if (sortBy && sortType) {
    pipeline.push({
      $sort: {
        [sortBy]: sortType === "asc" ? 1 : -1,
      },
    });
  } else {
    pipeline.push({ $sort: { createdAt: -1 } });
  }

  pipeline.push(
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$ownerDetails",
    }
  );

  const videoAggregate = Video.aggregate(pipeline);

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  const video = await Video.aggregatePaginate(videoAggregate, options);

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  // TODO: get video, upload to cloudinary, create video
  const { title, description } = req.body;
  console.log(title, description);

  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Title and description are required");
  }

  const videoLocalPath = await req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = await req.files?.thumbnail[0]?.path;

  if (!videoLocalPath || !thumbnailLocalPath) {
    throw new ApiError(400, "Video and thumbnail are required");
  }

  console.log("from video upload", req.files?.videoFile[0]);
  console.log("from thumbnail upload", req.files?.thumbnail[0]);
  if (!videoLocalPath || !thumbnailLocalPath) {
    throw new ApiError(400, "Video and thumbnail are required");
  }

  const videoFile = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoFile || !thumbnail) {
    throw new ApiError(
      400,
      "Video and thumbnail failed to upload on cloudinary"
    );
  }

  const duration = parseInt(videoFile?.duration);
  console.log(duration);
  const uploadVideo = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    owner: req.user?._id,
    description,
    duration,
    title,
  });

  if (!uploadVideo) {
    throw new ApiError(500, "Failed to upload video on server");
  }

  res
    .status(200)
    .json(new ApiResponse(200, uploadVideo, "uploaded successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  //TODO: get video by id
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  //* this code is from ChatGPT
  const video = await Video.aggregate([
    // 1. Match the video by its ID
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    // 2. Lookup likes for the video
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    // 3. Lookup owner details and their subscribers
    {
      $lookup: {
        from: "users",
        let: { ownerId: "$owner" },
        pipeline: [
          // Match the owner by their ID
          {
            $match: {
              $expr: { $eq: ["$_id", "$$ownerId"] },
            },
          },
          // Lookup subscribers for the owner
          {
            $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "channel",
              as: "subscribers",
            },
          },
          // Add fields for subscriber count and subscription status
          {
            $addFields: {
              subscribersCount: { $size: "$subscribers" },
              isSubscribed: { $in: [req.user?._id, "$subscribers.subscriber"] },
            },
          },
          // Project the required owner fields
          {
            $project: {
              username: 1,
              avatar: 1,
              subscribersCount: 1,
              isSubscribed: 1,
            },
          },
        ],
        as: "owner",
      },
    },
    // 4. Add fields to the resulting document
    {
      $addFields: {
        likesCount: { $size: "$likes" },
        owner: { $arrayElemAt: ["$owner", 0] },
        isLiked: { $in: [req.user?._id, "$likes.likedBy"] },
      },
    },
    // 5. Project the final fields to include in the output
    {
      $project: {
        videoFile: 1,
        title: 1,
        isPublished: 1,
        description: 1,
        views: 1,
        createdAt: 1,
        duration: 1,
        comments: 1,
        owner: 1,
        likesCount: 1,
        isLiked: 1,
      },
    },
  ]);

  if (!video) {
    throw new ApiError(400, "Video not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "successfully fetched video details"));
});

const updateVideo = asyncHandler(async (req, res) => {
  //TODO: update video details like title, description, thumbnail

  const { videoId } = req.params;
  const { title, description } = req.body;

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Video not found");
  }

  const updateDetails = {};

  if (title === undefined || title.trim() === "") {
    updateDetails.title = video.title;
  } else {
    updateDetails.title = title;
  }

  if (description === undefined || description.trim() === "") {
    updateDetails.description = video.description;
  } else {
    updateDetails.description = description;
  }

  if (video.owner?.toString() !== req.user?._id.toString()) {
    throw new ApiError(404, "Only owner can update their video");
  }

  const oldThumbnail = video.thumbnail;

  if (req.file?.path) {
    const newThumbnail = await uploadOnCloudinary(req.file?.path);

    console.log("new thumbnail", newThumbnail);

    if (!newThumbnail) {
      throw new ApiError(500, "Failed to update thumbnail");
    } else {
      updateDetails.thumbnail = newThumbnail.url;
    }

    const deleteThumbnail = await deleteFromCloudinary(oldThumbnail, "image");

    if (!deleteThumbnail) {
      throw new ApiError(500, "Failed to delete old thumbnail");
    }
  }

  console.log("update details", updateDetails);
  const update = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: updateDetails,
    },
    {
      new: true,
    }
  );

  if (!update) {
    throw new ApiError(500, "Failed to update video");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, update, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  //TODO: delete video
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Video not found");
  }

  if (video.owner?.toString() !== req.user?._id.toString()) {
    throw new ApiError(404, "Only owner can delete their video");
  }

  const deleteCloudThumbnail = await deleteFromCloudinary(
    video.thumbnail,
    "image"
  );
  const deleteCloudVideo = await deleteFromCloudinary(video.videoFile, "video");

  if (!deleteCloudThumbnail || !deleteCloudVideo) {
    throw new ApiError(500, "Failed to delete video from cloudinary");
  }

  const deleteVideoLikes = await Like.deleteMany({
    video: videoId,
  });

  if (!deleteVideoLikes) {
    throw new ApiError(500, "Failed to delete video likes");
  }

  const deleteVideoComments = await Comment.deleteMany({
    video: videoId,
  });

  if (!deleteVideoComments) {
    throw new ApiError(500, "Failed to delete video likes");
  }

  const deletedVideo = await Video.findByIdAndDelete(videoId);

  if (!deletedVideo) {
    throw new ApiError(500, "Failed to delete video");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { deleted: true }, "Video deleted successfully")
    );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video not found");
  }

  if (video.owner?.toString() !== req.user?._id.toString()) {
    throw new ApiError(404, "Only owner can update their video");
  }

  const updated = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: { isPublished: !video.isPublished },
    },
    {
      new: true,
    }
  );

  if (!updated) {
    throw new ApiError(500, "Failed to update video status");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isPublished: updated.isPublished },
        "status updated successfully"
      )
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
