import React from "react";
import { FaRegEye, FaRegHeart } from "react-icons/fa";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";

function Stats({ stats }) {
  return (
    <>
      <section className="grid sm:grid-cols-4 grid-cols-2 justify-evenly items-center gap-4">
        <div className="border border-slate-500 sm:p-3 p-2 rounded-sm">
          <MdOutlineSlowMotionVideo
            className="text-purple-500 mb-2"
            size={30}
          />
          <p className="text-lg">Total Videos</p>
          <span className="font-bold text-2xl">{stats?.totalVideos}</span>
        </div>

        <div className="border border-slate-500 sm:p-3 p-2 rounded-sm">
          <FaRegEye className="text-purple-500 mb-2" size={30} />
          <p className="text-lg">Total Views</p>
          <span className="font-bold text-2xl">{stats?.totalViews}</span>
        </div>

        <div className="border border-slate-500 sm:p-3 p-2 rounded-sm">
          <RxAvatar className="text-purple-500 mb-2" size={30} />
          <p className="text-lg">Total Subscribers</p>
          <span className="font-bold text-2xl">{stats?.totalSubscribers}</span>
        </div>

        <div className="border border-slate-500 sm:p-3 p-2 rounded-sm">
          <FaRegHeart className="text-purple-500 mb-2" size={30} />
          <p className="text-lg">Total Likes</p>
          <span className="font-bold text-2xl">{stats?.totalLikes}</span>
        </div>
      </section>
    </>
  );
}

export default Stats;
