"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";
import { CiLogin } from "react-icons/ci";
import { useForm } from "react-hook-form";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import classNames from "classnames";
import { useAuth } from "@/context/AuthContext";
import Alert from "@/utils/alerts.utils";

const LoginPage = () => {
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [typePassword, setTypePassword] = useState("password");

  const onSubmit = async (params) => {
    try {
      login(params);
    } catch (error) {
      Alert.error(error.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, []);

  return (
    <div className="w-[500px] bg-white border border-gray-200 absolute -translate-y-1/2 -translate-x-1/2  top-1/2 left-1/2 px-8 py-18 rounded-lg">
      <div className="mb-4">
        <h1 className="text-3xl">เข้าสู่ระบบ</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={classNames(errors.username ? "mb-1" : "mb-6")}>
          <label>ชื่อผู้ใช้</label>
          <TextField
            error={errors.username}
            {...register("username", {
              required: {
                value: true,
                message: "กรุณาระบุข้อมูล",
              },
              // pattern: {
              //   value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/,
              //   message: "ข้อมูลต้องประกอบด้วย a-z/A-z/0-9",
              // },
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
            {typePassword === "password" ? <FaRegEyeSlash className="text-2xl " /> : <FaRegEye className="text-2xl t" />}
          </button>
          {errors.password ? <small className="text-error">{errors.password.message}</small> : <></>}
        </div>
        <div className="text-right mb-6">
          <Link href="/register">
            <span className="text-primary underline">ลงทะเบียน</span>
          </Link>
        </div>
        <div>
          <Button type="submit" className="w-full flex justify-center items-center">
            <span className="mr-2">เข้าสู่ระบบ</span>
            <span>
              <CiLogin className="w-6 h-6" />
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
