import React from "react";
import Link from "next/link";
import Topnav from "./Topnav";
import Sidenav from "./Sidenav";

const Layout = ({ children }) => {
  return (
    <>
      <Topnav />
      <Sidenav />
      <div className="pl-[300px] pt-[70px] w-[100vw - 300px]">
        {/* <div className=" bg-yellow-200">{children}</div> */}
        <div className="w-[calc(100% - 300px)]  h-[100vh] p-4 bg-gray-100/60">
          <div className="">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Layout;
