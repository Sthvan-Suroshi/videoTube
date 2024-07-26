import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getChannelStats,
  getChannelVideos,
} from "../../store/Slices/dashboardSlice.js";
import Navbar from "../Navbar/Navbar";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { UploadVideo, Stats, VideoTable, DeleteVideo } from "../index.js";
import { deleteVideo } from "../../store/Slices/videoSlice.js";

function AdminPage() {
  const dispatch = useDispatch();
  const [popUp, setPopUp] = useState({
    uploadVideo: false,
    editVideo: false,
    deleteVideo: false,
  });

  const channelStats = useSelector((state) => state.dashboard?.channelStats);
  const channelVideos = useSelector((state) => state.dashboard.channelVideos);
  const userData = useSelector((state) => state.auth?.userData);
  const publishedStatus = useSelector((state) => state.video?.publishToggled);
  const loading = useSelector((state) => state.video?.loading);

  const [videoDetails, setVideoDetails] = useState(null);

  useEffect(() => {
    dispatch(getChannelStats());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getChannelVideos());
  }, [publishedStatus, loading]);

  const handleDeleteVideo = async () => {
    dispatch(deleteVideo(videoDetails?._id));
    setPopUp((prev) => ({
      ...prev,
      deleteVideo: !prev.deleteVideo,
  }));
  };

  return (
    <div className="bg-[#121212] min-h-screen h-full text-white relative">
      <Navbar />

      {popUp.deleteVideo && (
        <div className="fixed w-full h-full z-[999]">
          <DeleteVideo setPopUp={setPopUp} onDelete={handleDeleteVideo} />
        </div>
      )}

      {popUp.uploadVideo && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center px-24 ">
          <UploadVideo setPopUp={setPopUp} />
        </div>
      )}
      <div className="px-10">
        <div className="flex flex-wrap justify-between gap-4 my-6">
          <div className="block">
            <h1 className="text-2xl font-bold">
              Welcome Back, {userData?.username}
            </h1>
            <p className="text-sm text-gray-300">
              Seamless Video Management, Elevated Results.
            </p>
          </div>
          <div className="block">
            <button
              className="inline-flex items-center gap-x-2 bg-[#ae7aff] px-3 py-2 font-semibold text-black"
              onClick={() =>
                setPopUp((prev) => ({ ...prev, uploadVideo: true }))
              }
            >
              <PlusIcon className="h-5 w-5" strokeWidth={2} /> Upload video
            </button>
          </div>
        </div>
        <div className="my-6">
          <Stats stats={channelStats} />
        </div>
        <div className="">
          <VideoTable
            videos={channelVideos}
            setPopUp={setPopUp}
            setVideodetails={setVideoDetails}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
