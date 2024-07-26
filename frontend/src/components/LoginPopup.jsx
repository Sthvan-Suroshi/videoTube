import React from "react";
import { Link } from "react-router-dom";

const LoginPopup = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50">
      <div className="bg-black border border-slate-800 rounded-lg p-5 text-white text-center">
        <p className="text-xl font-medium mb-2 ">Login or Signup to continue</p>
        <div className="flex justify-around items-center gap-3">
          <Link to="/login" className="basis-1/2">
            <button
              className="bg-purple-500 w-full py-2 px-4  font-bold text-lg rounded"
              
            >
              Login
            </button>
          </Link>
          <Link to="/signup" className="basis-1/2">
            <button
              className="bg-purple-500 w-full py-2 px-4 font-bold text-lg rounded"
             
            >
              Signup
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
