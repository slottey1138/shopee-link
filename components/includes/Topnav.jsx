import React from "react";
import { useAuth } from "@/context/AuthContext";
import { CiLogout } from "react-icons/ci";

const Topnav = () => {
  const { user, logout } = useAuth();

  return (
    <div className="w-[calc(100%-300px)] h-[70px] bg-primary fixed top-0 right-0">
      <div className="w-full flex justify-end pt-4 px-4">
        {user?.role === "USER" ? <div className="mr-4 pt-2 text-white">เครดิต : {user?.credit}</div> : <></>}
        <div className="">
          <button onClick={logout} className="px-4 h-10 rounded-md uppercase cursor-pointer flex justify-center items-center text-white border border-white">
            อกกจากระบบ <CiLogout className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topnav;
