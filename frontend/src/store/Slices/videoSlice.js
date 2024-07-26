import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axiosInstance";

const initialState = {
  loading: false,
  uploading: false,
  uploaded: false,
  publishToggled: false,
};

export const uploadVideo = createAsyncThunk("uploadVideo", async (details) => {
  const form = new FormData();
  form.append("title", details.title);
  form.append("description", details.description);
  form.append("videoFile", details.videoFile[0]);
  form.append("thumbnail", details.thumbnail[0]);

  try {
    const response = await axiosInstance.post("/videos/", form);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const deleteVideo = createAsyncThunk("deleteVideo", async (videoId) => {
  try {
    const response = await axiosInstance.delete(`/videos/${videoId}`);
    console.log("deleted");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const togglePublish = createAsyncThunk(
  "togglePublish",
  async (videoId) => {
    try {
      const response = await axiosInstance.patch(
        `/videos/toggle/publish/${videoId}`
      );
      return response.data.data.isPublished;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    updateUploadState: (state) => {
      state.uploading = false;
      state.uploaded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadVideo.pending, (state) => {
        state.uploading = true;
        state.loading = true;
      })
      .addCase(uploadVideo.fulfilled, (state) => {
        state.uploading = false;
        state.uploaded = true;
        state.loading = false;
      });

    builder
      .addCase(deleteVideo.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteVideo.fulfilled, (state) => {
        state.loading = false;
      });

    builder.addCase(togglePublish.fulfilled, (state) => {
      state.publishToggled = !state.publishToggled;
      console.log(state.publishToggled);
    });
  },
});

export const { updateUploadState } = videoSlice.actions;

export default videoSlice.reducer;
