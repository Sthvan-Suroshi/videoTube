import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerUser, userLogin } from "../store/Slices/authSlice.js";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logo } from "../assets/data.jsx";
import { GetImagePreview, Input, Loader } from "./index.js";

function Signup() {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth?.loading);

  const submit = async (data) => {
    const response = await dispatch(registerUser(data));
    console.log(response);
    if (response?.payload?.success) {
      const username = data?.username;
      const password = data?.password;
      const loginResult = await dispatch(userLogin({ username, password }));

      if (loginResult?.type === "login/fulfilled") {
        navigate("/");
      } else {
        navigate("/login");
      }
    }
  };

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
    <>
      <div className="w-full h-screen text-white pt-9 flex justify-center items-center bg-[#121212]">
        <div className="flex flex-col space-y-2 justify-center items-center border border-slate-600 p-3 bg-slate-800">
          <form
            onSubmit={handleSubmit(submit)}
            className="space-y-4 p-2 text-sm sm:w-96 w-full"
          >
            <div className="w-full relative h-28 bg-[#222222]">
              <div className="w-full h-full">
                <GetImagePreview
                  name="coverImage"
                  control={control}
                  className="w-full h-28 object-cover border-none border-slate-900"
                  cameraIcon
                />
                <div className="text-sm absolute right-2 bottom-2 hover:text-purple-500 cursor-default">
                  cover Image
                </div>
              </div>
              {errors.coverImage && (
                <div className="text-red-500">{errors.coverImage.message}</div>
              )}

              <div className="absolute left-2 bottom-2 rounded-full border-2">
                <GetImagePreview
                  name="avatar"
                  isAvatar={true}
                  control={control}
                  className="object-cover rounded-full h-20 w-20 outline-none"
                  cameraIcon={true}
                  cameraSize={20}
                />
              </div>
            </div>
            {errors.avatar && (
              <div className="text-red-500">{errors.avatar.message}</div>
            )}
            <div className="w=full flex flex-col">
              <Input
                label="Username: "
                type="text"
                placeholder="Enter username"
                {...register("username", {
                  required: "username is required",
                })}
                className=" p-4"
              />
              {errors.username && (
                <span className="text-red-500">{errors.username.message}</span>
              )}

              <Input
                label="Email: "
                type="email"
                placeholder="Enter email"
                {...register("email", {
                  required: "email is required",
                })}
                className=" p-4"
              />
              {errors.email && (
                <span className="text-red-500">{errors.email.message}</span>
              )}

              <Input
                label="Fullname: "
                type="text"
                placeholder="Enter fullname"
                {...register("fullName", {
                  required: "fullName is required",
                })}
                className=" p-4"
              />
              {errors.fullName && (
                <span className="text-red-500">{errors.fullName.message}</span>
              )}

              <Input
                label="Password: "
                type="password"
                placeholder="Enter password"
                {...register("password", {
                  required: "password is required",
                })}
                className=" p-4"
              />
              {errors.password && (
                <span className="text-red-500">{errors.password.message}</span>
              )}
            </div>

            <button
              type="submit"
              className="w-full sm:py-3 py-2 bg-purple-500 hover:bg-purple-700 text-lg"
            >
              Signup
            </button>

            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link
                to={"/login"}
                className="text-purple-300 cursor-pointer hover:opacity-70"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;
