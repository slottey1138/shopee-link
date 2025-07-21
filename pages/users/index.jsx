import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import withProtectedUser from "@/hoc/withProtectedUser";
import Layout from "@/components/includes/Layout";
import { FaAnglesRight, FaAnglesLeft, FaAngleRight, FaAngleLeft, FaPencil, FaTrash } from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";
import classNames from "classnames";
import Alert from "@/utils/alerts.utils";
import dayjs from "dayjs";
import axios from "@/utils/api.utils";
import TextField from "@/components/ui/TextField";
import Unauthorize from "@/components/Unauthorized";
import Button from "@/components/ui/Button";

const ITEMS_PER_PAGE = 10;
const MAX_VISIBLE_PAGES = 7;

const UserPage = () => {
  const { user } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState({
    all: [],
    filter: [],
  });
  const [keyword, setKeyword] = useState("");

  const totalPages = Math.ceil(users?.filter?.length / ITEMS_PER_PAGE);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleFirst = () => {
    setCurrentPage(1);
  };

  const handleLast = () => {
    setCurrentPage(totalPages);
  };

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const left = Math.max(2, currentPage - 1);
    const right = Math.min(totalPages, currentPage + 2);

    if (left > 2) {
      pages.push(1, "...");
    } else {
      for (let i = 1; i < left; i++) pages.push(i);
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) pages.push("...", totalPages);
    else for (let i = right + 1; i <= totalPages; i++) pages.push(i);

    return pages;
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user?.user_id}`);

      if (response.status === 200) {
        setUsers({
          all: response.data,
          filter: response.data,
        });
      }
    } catch (error) {
      Alert.error(error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (keyword == "") {
      setUsers({ ...users, filter: users.all });
    } else {
      let results = users.all.filter((item) => {
        return item.username.toLowerCase().includes(keyword.toLowerCase()) || item.phone.toLowerCase().includes(keyword.toLowerCase());
      });
      setUsers({ ...users, filter: results });
    }
  }, [keyword]);

  const handleDelete = async (userId) => {
    try {
      const confirm = await Alert.confirm("Your want to delete this user ?");

      if (confirm.isConfirmed) {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`);
        if (response.status === 200) {
          const { message } = response.data;
          Alert.success(message).then(() => fetchUsers());
        }
      }
    } catch (error) {
      Alert.error(error.message);
    }
  };

  const generateStatus = (status) => {
    if (status === 1) {
      return <div className="text-xs text-green-500 bg-green-500/30 block py-1 font-bold text-center rounded">ปกติ</div>;
    } else if (status === 2) {
      return <div className="text-xs text-amber-500 bg-amber-400/30 block py-1 font-bold text-center rounded">รอตรวจสอบ</div>;
    } else if (status === 3) {
      return <div className="text-xs text-red-500 bg-red-400/30 block py-1 font-bold text-center rounded">ปฏิเสธ</div>;
    }
  };

  if (!["SUPERADMIN", "ADMIN"].includes(user?.role)) {
    return (
      <Layout>
        <Unauthorize />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white border border-gray-100">
        <div className="h-18 w-full bg-white px-6 pt-5 border-b border-gray-100">
          <h1 className="text-2xl font-medium">ผู้ใช้งาน </h1>
        </div>
        <div className="grid grid-cols-12 py-4 px-4">
          <div className="col-span-4">
            <TextField className="w-1/3" placeholder="ค้นหา..." onChange={(e) => setKeyword(e.target.value)} />
          </div>
          <div className="col-span-8">
            <div className="text-right">
              <Link href="/users/create">
                <Button className="uppercase">
                  <div className="flex">
                    <span className="mr-2">Create</span>
                    <FiPlus className="mt-1" />
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <table style={{ width: "100%", minWidth: "700px" }} className="bg-white">
          <thead className="w-full h-14 bg-primary text-white">
            <tr>
              <th className="w-[100px]">ลำดับ</th>
              <th className="text-left">ชื่อผู้ใข้งาน</th>
              <th className="text-left">เบอร์โทรศัพท์</th>
              <th className="text-left">เครดิต</th>
              <th className="text-left">ประเภทผู้ใช้</th>
              <th className="w-[100px] text-center">สถานะ</th>
              <th className=" text-center">สร้างเมื่อ</th>
              <th className=" text-center">แก้ไขล่าสุด</th>
              <th className="text-center"></th>
            </tr>
          </thead>
          <tbody>
            {users?.filter?.length > 0 ? (
              users?.filter?.map((user, index) => (
                <tr className={classNames(`h-14`, index % 2 === 0 ? "bg-primary/10" : "")} key={`users_${index}`}>
                  <td className="text-center w-[100px]">{index + 1}</td>
                  <td className="text-left">{user.username}</td>
                  <td className="text-left">{user.phone}</td>
                  <td className="text-left">{user.credit}</td>
                  <td className="text-left">{user.role}</td>
                  <td className="text-left">{generateStatus(user.status)}</td>
                  <td className="text-center">{dayjs(user.createdAt).format("DD-MM-YYYY HH:mm:ss")}</td>
                  <td className="text-center">{dayjs(user.updatedAt).format("DD-MM-YYYY HH:mm:ss")}</td>
                  <td className="text-center">
                    <div className="flex justify-center">
                      <Link href={`/users/edit/${user.user_id}`}>
                        <button className="w-10 h-10 bg-amber-400 text-center text-white rounded-md justify-center align-middle cursor-pointer hover:bg-amber-400/70 transition duration-300 mx-1">
                          <FaPencil className="block mx-auto" />
                        </button>
                      </Link>
                      <button
                        className="w-10 h-10 bg-red-400 text-center text-white rounded-md justify-center align-middle cursor-pointer hover:bg-red-400/70 transition duration-300 mx-1"
                        onClick={() => handleDelete(user.user_id)}>
                        <FaTrash className="block mx-auto" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  ไม่มีข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="relative mt-4 md:pt-0 py-10 mb-10">
          {/* <span className="absolute left-0 top-0 text-gray-400 pl-4">
            {totalPages * currentPage - 9}-{totalPages * currentPage} จาก {currentItems.length} รายการ
          </span> */}
          <div className="flex sm:justify-end justify-between ">
            <button onClick={handleFirst} disabled={currentPage === 1} className="cursor-pointer  h-[32px] md:w-12 w-8 text-center mt-2 sm:mx-1 mx-0">
              <FaAnglesLeft className="block mx-auto text-primary text-[14px]" />
            </button>{" "}
            <button onClick={handlePrev} disabled={currentPage === 1} className="cursor-pointer  h-[32px] md:w-12 w-8  text-center mt-2 sm:mx-1 mx-0">
              <FaAngleLeft className="block mx-auto text-primary text-[14px]" />
            </button>
            <div className="sm:mt-2 mt-2">
              {getPageNumbers().map((p, idx) =>
                typeof p === "number" ? (
                  <button
                    key={idx}
                    onClick={() => handlePageClick(p)}
                    className={classNames(`sm:w-[32px] sm:h-[32px] w-[26px] h-[26px] text-[16px] mx-1 rounded cursor-pointer`, p === currentPage ? "bg-primary text-white" : "text-gray-400")}>
                    {p}
                  </button>
                ) : (
                  <span key={idx} className="text-gray-400" style={{ margin: "0 6px" }}>
                    ...
                  </span>
                )
              )}
            </div>
            <button onClick={handleNext} disabled={currentPage === totalPages} className="cursor-pointer h-[32px] md:w-12 w-8 text-center mt-2 sm:mx-1 mx-0">
              <FaAngleRight className="block mx-auto text-primary text-[14px]" />
            </button>
            <button onClick={handleLast} disabled={currentPage === totalPages} className="cursor-pointer h-[32px] md:w-12 w-8 text-center mt-2 sm:mx-1 mx-0">
              <FaAnglesRight className="block mx-auto text-primary text-[14px] " />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withProtectedUser(UserPage);
