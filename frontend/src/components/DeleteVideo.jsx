import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";

function DeleteVideo({ setPopUp, onDelete }) {
  return (
    <div className="relative h-full w-full bg-gray-900 bg-opacity-70 ">
      <div className="absolute w-full z-10 flex flex-col px-4 pb-[86px] pt-4 sm:top-[calc(82px)] sm:px-14 sm:py-8 text-white">
        <div className="mx-auto w-full max-w-lg overflow-auto rounded-lg border border-gray-700 bg-[#121212] p-4">
          <div className="mb-6 flex items-start gap-4">
            <span className="inline-block h-8 w-8 shrink-0 rounded-full bg-red-200 p-1 text-red-700">
              <TrashIcon />
            </span>
            <h2 className="text-xl font-semibold">
              Delete Video
              <span className="block text-sm text-gray-300">
                Are you sure you want to delete this video? Once its deleted,
                you will not be able to recover it.
              </span>
            </h2>
            <button
              className="ml-auto h-6 w-6 shrink-0"
              onClick={(prev) =>
                setPopUp({
                  ...prev,
                  deleteVideo: false,
                })
              }
            >
              <XMarkIcon />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              className="col-span-2 border px-4 py-3 sm:col-span-1"
              onClick={(prev) =>
                setPopUp({
                  ...prev,
                  deleteVideo: false,
                })
              }
            >
              Cancel
            </button>
            <button
              className="col-span-2 bg-red-700 px-4 py-3 disabled:bg-[#E4D3FF] sm:col-span-1"
              onClick={onDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteVideo;
