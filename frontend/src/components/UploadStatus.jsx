import {
  CheckCircleIcon,
  FilmIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { Loader } from "./index";
import { useDispatch } from "react-redux";
import { updateUploadState } from "../store/Slices/videoSlice.js";

function UploadStatus({ uploading, uploaded, setStatus, size, videoName }) {
  const discpatch = useDispatch();

  function handleFinish() {
    
    discpatch(updateUploadState());
    setStatus(false);
  }

  return (
    <div>
      <div className="flex items-center justify-center  px-4 pt-4 sm:h-[calc(100vh-82px)] sm:px-14 sm:py-8 text-white h-full">
        <div className="w-full max-w-lg overflow-auto rounded-lg border border-gray-700 bg-[#121212] p-4">
          <div className="mb-4 flex items-start justify-between">
            <h2 className="text-xl font-semibold">
              {uploading ? "Uploading Video..." : "Uploaded Successfully"}

              <span className="block text-sm text-gray-300">
                Track your video uploading process.
              </span>
            </h2>
            <button className="h-6 w-6">
              <XMarkIcon />
            </button>
          </div>
          <div className="mb-6 flex gap-x-2 border p-3">
            <div className="w-8 shrink-0">
              <span className="inline-block w-full rounded-full bg-[#E4D3FF] p-1 text-[#AE7AFF]">
                <FilmIcon />
              </span>
            </div>
            <div className="flex flex-col">
              <h6>{videoName}</h6>
              <p className="text-sm">{size} MB</p>
              {uploading && (
                <div className="mt-2 flex items-center">
                  <span className="mr-2 inline-block w-6 text-[#ae7aff]">
                    <Loader />
                  </span>
                  Uploading...
                </div>
              )}

              {uploaded && (
                <div className="mt-2 flex items-center">
                  <span className="mr-2 inline-block w-6 text-[#ae7aff]">
                    <CheckCircleIcon />
                  </span>
                  Uploaded Successfully
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="border px-4 py-3">Cancel</button>
            <button
              onClick={handleFinish}
              className={`bg-[#9b64f5] px-4 py-3 text-black ${
                uploading && "cursor-not-allowed disabled:bg-[#b78bff]"
              }`}
              disabled={uploading}
            >
              Finish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadStatus;
