import React from "react";
import { logo } from "../../assets/data";
import { CiSearch } from "react-icons/ci";
import Search from "./Search";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Navbar() {
  const user = useSelector((state) => state.auth?.userData);
  const navigate = useNavigate();
  return (
    <div className="text-white w-full border-x-0 border bg-[#121212] flex px-10 py-3 justify-between items-center sticky top-0 z-[999]">
      <div className="w-14 cursor-pointer" onClick={() => navigate("/")}>
        {logo}
      </div>
      <div className="search flex gap-3 items-center justify-center ">
        <CiSearch className="text-2xl" />
        <Search />
      </div>
      <div className="basis-24 flex justify-end">
        {user ? (
          <div className=" ">
            <img
              src={user?.avatar}
              alt="avatar"
              className=" h-12 w-12 rounded-full object-cover"
            />
          </div>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className="group/btn mr-1 flex w-auto items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]"
              type="submit"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="group/btn mr-1 flex w-auto items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]"
              type="submit"
            >
              Signup
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
