import React from "react";
import { useForm } from "react-hook-form";
import { logo } from "../assets/data.jsx";
import { userLogin, getCurrentUser } from "../store/Slices/authSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Input, Loader } from "./index.js";
import toast from "react-hot-toast";

function Login() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth?.loading);
  const userData = useSelector((state) => state.auth?.userData);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const login = async (details) => {
    try {
      const response = await dispatch(userLogin(details));
      const user = await dispatch(getCurrentUser());
      console.log(user);
      if (user && response?.type === "userLogin/fulfilled") {
        toast.success("Login Successful");
        navigate("/");
      } else {
        toast.error("Login Failed");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(userData);

  if (loading) {
    return (
      <>
        <div className="h-screen flex justify-center items-center bg-black">
          <Loader h="28" />
        </div>
      </>
    );
  }
  return (
    <div className="h-screen overflow-y-auto bg-[#121212] text-white flex justify-center items-center">
      <div className="mx-auto my-8 flex w-full max-w-sm flex-col px-4 bg-slate-800 p-9 rounded space-y-2">
        <div className="mx-auto inline-block w-14">{logo}</div>
        <div className="mb-6 w-full text-center text-xl font-semibold uppercase">
          Play
        </div>
        <form
          action=""
          className="flex flex-col"
          onSubmit={handleSubmit(login)}
        >
          <Input
            label="Email: "
            type="email"
            placeholder="Enter Email"
            {...register("email", {
              required: "email is required",
            })}
            className="mb-2 p-4"
          />
          {errors.username && (
            <span className="text-red-500">{errors.email.message}</span>
          )}

          <Input
            label="Password: "
            type="password"
            placeholder="Enter Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
            className="mb-2 p-4"
          />
          {errors.username && (
            <span className="text-red-500">{errors.email.message}</span>
          )}

          <button
            type="submit"
            className="w-full sm:py-3 py-2 bg-purple-500 hover:bg-purple-700 text-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
