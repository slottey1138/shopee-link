"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import Layout from "@/components/includes/Layout";
import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";
import { LiaTimesSolid } from "react-icons/lia";
import { IoSaveOutline } from "react-icons/io5";
import axios from "@/utils/api.utils";
import Alert from "@/utils/alerts.utils";
import { useForm } from "react-hook-form";
import Unauthorize from "@/components/Unauthorized";
import withProtectedUser from "@/hoc/withProtectedUser";
import classNames from "classnames";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";

const CreateUser = () => {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const userId = params?.user_id;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      status: 1,
      credit: 0,
    },
  });

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [data, setData] = useState(null);
  const [typePassword, setTypePassword] = useState("password");
  const [typeConfirmPassword, setTypeConfirmPassword] = useState("password");

  const fetchUser = async (userId) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`);

      if (response.status === 200) {
        setData(response.data);
      }
    } catch (error) {
      Alert.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId]);

  const handleCreate = async (params) => {
    try {
      setSending(true);
      const payload = {
        username: params.username,
        phone: params.phone,
        credit: params.credit,
        status: params.status,
        password: params.password,
        role: params.role,
        created_by: user?.user_id,
        updated_by: user?.user_id,
      };
      console.log("patload", payload);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, payload);

      if (response.status === 200) {
        const { message } = response.data;
        Alert.success(message).then(() => router.push("/users"));
      } else {
        const { message } = response.data;
        Alert.error(message);
      }
    } catch (error) {
      const { data } = error.response;
      Alert.error(data.message);
    } finally {
      setSending(false);
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
      <div className="bg-white">
        <div className="h-18 w-full bg-white px-6 pt-5 border-b border-gray-100">
          <h1 className="text-2xl font-medium">เพิ่มผู้ใช้งาน</h1>
        </div>
        <form onSubmit={handleSubmit(handleCreate)}>
          <div className="w-1/2 mx-auto py-4">
            <div className="mb-4">
              <label>ชื่อผู้ใช้</label>
              <TextField
                error={errors.username}
                defaultValue={data?.username}
                {...register("username", {
                  required: {
                    value: true,
                    message: "กรุณาระบุข้อมูล",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/,
                    message: "ข้อมูลต้องประกอบด้วย a-z/A-z/0-9",
                  },
                  minLength: {
                    value: 6,
                    message: "ระบุข้อมูลอย่างน้อย 6 ตัวอักษร",
                  },
                  maxLength: {
                    value: 20,
                    message: "ข้อมูลต้องไม่เกิน 20 ตัวอักษร",
                  },
                })}
              />
              {errors.username ? <small className="text-error">{errors.username.message}</small> : <></>}
            </div>
            <div className="mb-4">
              <label>เบอร์โทรศัพท์</label>
              <TextField
                error={errors.phone}
                defaultValue={data?.phone}
                {...register("phone", {
                  required: {
                    value: true,
                    message: "กรุณาระบุข้อมูล",
                  },
                  pattern: {
                    value: /^0[0-9]{9}$/,
                    message: "รูปแบบข้อมูลไม่ถูกต้อง",
                  },
                })}
              />
              {errors.phone ? <small className="text-error">{errors.phone.message}</small> : <></>}
            </div>
            <div className="mb-4">
              <label>เครดิต</label>
              <TextField
                error={errors.credit}
                {...register("credit", {
                  required: {
                    value: true,
                    message: "กรุณาระบุข้อมูล",
                  },
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "รูปแบบข้อมูลไม่ถูกต้อง",
                  },
                })}
                maxLength="5"
                defaultValue={data?.credit}
              />
              {errors.credit ? <small className="text-error">{errors.credit.message}</small> : <></>}
            </div>
            <div className="mb-4">
              <label>ประเภทผู้ใช้งาน</label>
              <select
                className={classNames(`border w-full h-12  rounded-md focus:outline-none px-2 transition duration-300 focus:border-primary`, errors?.role ? "border-error" : "border-gray-300")}
                {...register("role", {
                  required: {
                    value: true,
                    message: "กรุณาระบุข้อมูล",
                  },
                })}
                defaultValue={data?.role}>
                <option value="">Select</option>
                {user?.role === "SUPERADMIN" ? <option value="ADMIN">ADMIN</option> : <></>}
                <option value="USER">USER</option>
              </select>
            </div>
            <div className={classNames("relative", errors.password ? "mb-1" : "mb-6")}>
              <label>รหัสผ่าน</label>
              <TextField
                type={typePassword}
                error={errors.password}
                {...register("password", {
                  required: {
                    value: true,
                    message: "กรุณาระบุข้อมูล",
                  },
                  minLength: {
                    value: 8,
                    message: "ระบุข้อมูลอย่างน้อย 8 ตัวอักษร",
                  },
                  maxLength: {
                    value: 30,
                    message: "ข้อมูลต้องไม่เกิน 30 ตัวอักษร",
                  },
                })}
              />
              <button
                type="button"
                className="w-8 h-8 absolute right-2 top-8 justify-center flex items-center cursor-pointer focus:outline-none"
                onClick={() => (typePassword === "text" ? setTypePassword("password") : setTypePassword("text"))}>
                {typePassword === "password" ? <FaRegEyeSlash className="text-2xl " /> : <FaRegEye className="text-2xl " />}
              </button>
              {errors.password ? <small className="text-error">{errors.password.message}</small> : <></>}
            </div>
            <div className={classNames("relative", errors.confirmPassword ? "mb-1" : "mb-6")}>
              <label>ยืนยันหัสผ่าน</label>
              <TextField
                type={typeConfirmPassword}
                error={errors.confirmPassword}
                {...register("confirmPassword", {
                  required: {
                    value: true,
                    message: "กรุณาระบุข้อมูล",
                  },
                  validate: (value) => value === watch("password") || "รหัสผ่านไม่ตรงกัน",
                })}
              />
              <button
                type="button"
                className="w-8 h-8 absolute right-2 top-8 justify-center flex items-center cursor-pointer focus:outline-none"
                onClick={() => (typeConfirmPassword === "text" ? setTypeConfirmPassword("password") : setTypeConfirmPassword("text"))}>
                {typeConfirmPassword === "password" ? <FaRegEyeSlash className="text-2xl " /> : <FaRegEye className="text-2xl" />}
              </button>
              {errors.confirmPassword ? <small className="text-error">{errors.confirmPassword.message}</small> : <></>}
            </div>
            <div className="mb-8">
              <label>สถานะ</label>
              <div className="flex gap-10 mt-2">
                <div className="inline-flex items-center">
                  <label className="relative flex items-center cursor-pointer" htmlFor="active">
                    <input
                      type="radio"
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-primary transition-all focus:outline-none"
                      id="active"
                      defaultChecked={watch("status") === 1}
                      value={1}
                      {...register("status")}
                    />
                    <span className="absolute bg-primary w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
                  </label>
                  <label className="ml-2 text-slate-600 cursor-pointer text-sm" htmlFor="active">
                    ปกติ
                  </label>
                </div>
                <div className="inline-flex items-center">
                  <label className="relative flex items-center cursor-pointer" htmlFor="pending">
                    <input
                      type="radio"
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-primary transition-all focus:outline-none"
                      id="pending"
                      defaultChecked={watch("status") === 2}
                      value={2}
                      {...register("status")}
                    />
                    <span className="absolute bg-primary w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
                  </label>
                  <label className="ml-2 text-slate-600 cursor-pointer text-sm" htmlFor="pending">
                    รอตรวจสอบ
                  </label>
                </div>
                <div className="inline-flex items-center">
                  <label className="relative flex items-center cursor-pointer" htmlFor="reject">
                    <input
                      type="radio"
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-primary transition-all focus:outline-none"
                      id="reject"
                      defaultChecked={watch("status") === 3}
                      value={3}
                      {...register("status")}
                    />
                    <span className="absolute bg-primary w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
                  </label>
                  <label className="ml-2 text-slate-600 cursor-pointer text-sm" htmlFor="reject">
                    ปฏิเสธ
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button className="w-1/4 flex justify-center items-center mr-2" color="secondary" onClick={() => router.push("/users")} type="button">
                <span className="mr-2">ยกเลิก</span>
                <LiaTimesSolid />
              </Button>
              <Button className="w-1/4 flex justify-center items-center mr-2" type="submit" disabled={sending}>
                <span className="mr-2">บันทึก</span>
                <IoSaveOutline className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default withProtectedUser(CreateUser);
