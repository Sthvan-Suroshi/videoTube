import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {
  Home,
  Login,
  Signup,
  ChangePassword,
  DeleteVideo,
  AdminPage,
  Auth,
} from "./components";
import Layout from "./components/Layout";
import { getCurrentUser } from "./store/Slices/authSlice";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/" element={<Layout />}>
          <Route
            path=""
            element={
              <Auth authentication={false}>
                <Home />
              </Auth>
            }
          />
          <Route
            path="/change-password"
            element={
              <Auth authentication={true}>
                <ChangePassword />
              </Auth>
            }
          />

          <Route path="/delete-video" element={<DeleteVideo />} />
        </Route>
        <Route
          path="/admin"
          element={
            <Auth authentication={true}>
              <AdminPage />
            </Auth>
          }
        />
      </Routes>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default App;
