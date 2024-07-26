import React, { useState } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { GetImagePreview, Input, UploadStatus } from "./index";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {  uploadVideo } from "../store/Slices/videoSlice.js";
import toast from "react-hot-toast";

function UploadVideo({ setPopUp }) {
  const {
    register,
    handleSubmit,
    resetField,
    control,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  const [videoName, setVideoName] = useState("");
  const [size, setSize] = useState("0");
  const uploading = useSelector((state) => state.video?.uploading);
  const uploaded = useSelector((state) => state.video?.uploaded);

  const [status, setStatus] = useState(false);

  const upload = async (data) => {
    let videoSize = data.videoFile[0]?.size;
    videoSize = Math.ceil(videoSize / 1024 / 1024);
    setSize(videoSize);
    setStatus(true);

    try {
      const res = await dispatch(uploadVideo(data));
      console.log(res);

      resetField("title");
      resetField("description");
      resetField("videoFile");
      resetField("thumbnail");

      if (res.type === "uploadVideo/fulfilled") {
        toast.success("Video Uploaded Successfully");
      }

      setPopUp((prev) => ({
        ...prev,
        uploadVideo: !prev.uploadVideo,
      }));
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  console.log(uploading);
  console.log(uploaded);
  if (status) {
    return (
      <div className="w-full">
        <UploadStatus
          uploading={uploading}
          uploaded={uploaded}
          setStatus={setStatus}
          size={size}
          videoName={videoName}
        />
      </div>
    );
  }

  return (
    <>
      <form
        action=""
        onSubmit={handleSubmit(upload)}
        className="relative w-3/4 h-3/4 p-6  shadow-lg"
      >
        <div className="h-full overflow-y-auto bg-[#121212] text-white custom-scrollbar rounded-lg">
          <div className=" inset-0 z-10  px-4 pb-[86px] pt-4 sm:px-14 sm:py-8 rounded-xl">
            <div className="h-full overflow-auto border bg-[#121212]">
              <div className="flex items-center justify-between border-b p-4">
                <h2 className="text-xl font-semibold">Upload Videos</h2>
              </div>
              <div className="mx-auto flex w-full max-w-3xl flex-col gap-y-4 p-4">
                <div className="w-full border-2 border-dashed">
                  <GetImagePreview
                    label={"Thumbnail"}
                    name="thumbnail"
                    control={control}
                    className="w-full h-80 object-cover "
                    cameraIcon
                  />
                </div>

                <div className="w-full border-2 border-dashed text-center p-4 flex items-center justify-between">
                  <span className=" inline-block w-12  rounded-full bg-[#E4D3FF] p-4 text-[#AE7AFF]">
                    <ArrowUpTrayIcon />
                  </span>
                  <h6 className=" min-w-24 font-semibold">
                    {videoName
                      ? `${videoName}`
                      : "Select or Drag and Drop Video"}
                  </h6>
                  <p className="text-gray-400">
                    Your videos will be private untill you publish them.
                  </p>
                  <label
                    htmlFor="upload-video"
                    className="group/btn inline-flex w-auto cursor-pointer items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]"
                  >
                    <input
                      type="file"
                      id="upload-video"
                      className="sr-only"
                      {...register("videoFile", {
                        required: "Video is required",
                      })}
                      accept="video/*"
                      onChange={(e) => setVideoName(e.target.files[0]?.name)}
                    />
                    Select Video
                  </label>
                  {errors.videoFile && (
                    <p className="text-red-500">{errors.videoFile.message}</p>
                  )}
                </div>

                <div className="w-full">
                  <label htmlFor="title" className="mb-1 inline-block">
                    Title<sup>*</sup>
                  </label>

                  <input
                    id="title"
                    type="text"
                    className="w-full border bg-transparent px-2 py-1 outline-none"
                    {...register("title", {
                      required: "Title is required",
                    })}
                  />
                  {errors.title && (
                    <p className="text-red-500">{errors.title.message}</p>
                  )}
                </div>
                <div className="w-full">
                  <label htmlFor="desc" className="mb-1 inline-block">
                    Description<sup>*</sup>
                  </label>

                  <textarea
                    id="description"
                    className="h-40 w-full resize-none border bg-transparent px-2 py-1 outline-none"
                    {...register("description", {
                      required: "Description is required",
                    })}
                  ></textarea>
                  {errors.description && (
                    <p className="text-red-500">{errors.description.message}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center m-4">
              <button
                className="group/btn mr-1 flex w-auto items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]"
                type="submit"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default UploadVideo;
