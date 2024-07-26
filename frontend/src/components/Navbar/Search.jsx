import React from "react";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function Search() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const search = (data) => {
    const query = data?.query;
    navigate(`/search/${query}`);
  };

  return (
    <>
      <form onSubmit={handleSubmit(search)}>
        <input
          className="bg-[#0E0F0F] text-white outline-none focus:bg-[#222222] duration-200 border border-slate-600 px-4 py-1 w-64 rounded-lg "
          placeholder="Search"
          {...register("query", { required: true })}
        />
      </form>
    </>
  );
}

export default Search;
