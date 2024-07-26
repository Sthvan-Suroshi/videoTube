import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axiosInstance";

const initialState = {
  loading: false,
  status: false,
  userData: null,
};

export const changePassword = createAsyncThunk(
  "changePassword",
  async (details) => {
    try {
      const response = await axiosInstance.post(
        "/users/change-password",
        details
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const updateAvatar = createAsyncThunk("updateAvatar", async (avatar) => {
  try {
    const response = await axiosInstance.patch("/users/update-avatar", avatar);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const coverImage = createAsyncThunk(
  "updateCoverImage",
  async (cover) => {
    try {
      const response = await axiosInstance.patch("/users/cover-image", cover);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const updateUserDetails = createAsyncThunk(
  "updateDetails",
  async (details) => {
    try {
      const response = await axiosInstance.patch(
        "/users/update-account",
        details
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        state.userData = action.payload;
      });

    builder
      .addCase(updateAvatar.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        state.userData = action.payload;
      });

    builder
      .addCase(coverImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(coverImage.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        state.userData = action.payload;
      });

    builder
      .addCase(updateUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        state.userData = action.payload;
      });
  },
});

export default userSlice.reducer;
