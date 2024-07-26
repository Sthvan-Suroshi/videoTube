import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axiosInstance";

const initialState = {
  loading: false,
  status: false,
  userData: "",
};

export const registerUser = createAsyncThunk(
  "registerUser",
  async (details) => {
    const form = new FormData();
    form.append("username", details.username);
    form.append("fullName", details.name);
    form.append("email", details.email);
    form.append("password", details.password);
    form.append("avatar", details.avatar[0]);
    console.log(form);
    if (details.coverImage) {
      form.append("coverImage", details.coverImage[0]);
    }

    try {
      const response = await axiosInstance.post("/users/register", form);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const userLogin = createAsyncThunk("userLogin", async (details) => {
  try {
    const response = await axiosInstance.post("/users/login", details);

    return response.data.data.user;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const getCurrentUser = createAsyncThunk("getCurrentUser", async () => {
  try {
    const response = await axiosInstance.get("/users/current-user");
    return response.data.data;
  } catch (error) {
    throw error;
  }
});

export const userLogout = createAsyncThunk("logout", async () => {
  try {
    const { data } = await axiosInstance.post("/users/logout");
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const refereshAccessToken = createAsyncThunk(
  "refershAccessToken",
  async () => {
    try {
      const { data } = await axiosInstance.get("/users/refresh-token");
      return data.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        state.userData = action.payload;
      });

    builder
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        state.userData = action.payload;
      })
      .addCase(userLogin.rejected, (state) => {
        state.loading = false;
        state.status = false;
      });

    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        state.userData = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.status = false;
      });

    builder
      .addCase(userLogout.pending, (state) => {
        state.loading = true;
      })
      .addCase(userLogout.fulfilled, (state) => {
        state.loading = false;
        state.status = true;
        state.userData = null;
      });

    builder
      .addCase(refereshAccessToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refereshAccessToken.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        state.userData = action.payload;
      });
  },
});

export default authSlice.reducer;
