"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import Alert from "@/utils/alerts.utils";
import axios from "@/utils/api.utils";

const RegisterPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [typePassword, setTypePassword] = useState("password");
  const [typeConfirmPassword, setTypeConfirmPassword] = useState("password");

  const onSubmit = async (data) => {
    try {
      const payload = {
        username: data.username,
        phone: data.phone,
        password: data.password,
        role: "USER",
        created_by: 1,
        updated_by: 1,
      };

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/register`, payload);

      if (response.status === 200) {
        const { message } = response.data;

        Alert.success(message).then(() => router.push("/login"));
      } else {
        const { message } = response.data;
        Alert.error(message);
      }
    } catch (error) {
      let response = error.response;
      const { message } = response.data;
      Alert.error(message);
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <h1 className="text-3xl">ลงทะเบียน</h1>
        </div>
        <div className={classNames(errors.username ? "mb-1" : "mb-6")}>
          <label>ชื่อผู้ใช้</label>
          <TextField
            error={errors.username}
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
        <div className={classNames(errors.phone ? "mb-1" : "mb-6")}>
          <label>เบอร์โทรศัพท์</label>
          <TextField
            error={errors.phone}
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
        <div className="mb-4">
          <Button type="submit" className="w-full">
            <span className="mr-2">ลงทะเบียน</span>
          </Button>
        </div>
      </form>
      <div className="">
        เป็นสมาชิกอยู่แล้ว ?{" "}
        <Link href="/login">
          <span className="text-primary underline">เข้าสู่ระบบ</span>
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
