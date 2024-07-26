import React, { useEffect } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { TogglePublish } from "../index.js";

function VideoTable({ videos, setPopUp, setVideodetails }) {
  return (
    <div>
      <div className="w-full overflow-auto bg-[#121212] text-white">
        <table className="w-full min-w-[1200px] border-collapse border text-white">
          <thead>
            <tr>
              <th className="border-collapse border-b p-4 border">Status</th>
              <th className="border-collapse border-b p-4 border">Status</th>
              <th className="border-collapse border-b p-4 border">Uploaded</th>
              <th className="border-collapse border-b p-4 border">Rating</th>
              <th className="border-collapse border-b p-4 border">
                Date uploaded
              </th>
              <th className="border-collapse border-b border">Edit / Delete</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <tr key={video._id} className="group border">
                <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                  <div className="flex justify-center">
                    <label
                      htmlFor={"vid-pub-" + video.id}
                      className="relative inline-block w-12 cursor-pointer overflow-hidden"
                    >
                      <TogglePublish
                        videoId={video._id}
                        isPublished={video.isPublished}
                      />
                    </label>
                  </div>
                </td>
                <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                  <div className="flex justify-center min-w-24">
                    <span
                      className={
                        ("inline-block rounded-2xl border px-1.5 py-0.5",
                        video.isPublished
                          ? "border-green-600 text-green-600"
                          : "border-orange-600 text-orange-600")
                      }
                    >
                      {video.isPublished ? "Published" : "Unpublished"}
                    </span>
                  </div>
                </td>
                <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                  <div className="flex justify-center gap-4 ">
                    <h3 className="font-semibold">{video.title}</h3>
                  </div>
                </td>
                <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                  <div className="flex justify-center gap-4">
                    <span className="inline-block rounded-xl bg-green-200 px-1.5 py-0.5 text-green-700">
                      {video.likesCount} likes
                    </span>
                  </div>
                </td>
                <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none text-center ">
                  {video.createdAt.day}/{video.createdAt.month}/
                  {video.createdAt.year}
                </td>
                <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                  <div className="flex gap-4 justify-center">
                    <button
                      className="h-5 w-5 hover:text-[#ae7aff]"
                      onClick={() => {
                        setPopUp((prev) => ({
                          ...prev,
                          deleteVideo: !prev.deleteVideo,
                        }));
                        setVideodetails(video);
                      }}
                    >
                      <TrashIcon />
                    </button>
                    <button className="h-5 w-5 hover:text-[#ae7aff]">
                      <PencilIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VideoTable;
