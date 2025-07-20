"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import Layout from "@/components/includes/Layout";
import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";
import { LiaTimesSolid } from "react-icons/lia";
import { IoSaveOutline } from "react-icons/io5";
import Link from "next/link";
import axios from "axios";
import Alert from "@/utils/alerts.utils";
import { useForm } from "react-hook-form";
import Unauthorize from "@/components/Unauthorized";
import withProtectedUser from "@/hoc/withProtectedUser";

const EditUser = () => {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const userId = params?.user_id;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      status: 1,
    },
  });

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [data, setData] = useState(null);

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

  const handleUpdate = async (params) => {
    try {
      setSending(true);
      const payload = {
        username: params.username,
        phone: params.phone,
        credit: params.credit,
        status: params.status,
      };
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`, payload);

      if (response.status === 200) {
        const { message } = response.data;
        Alert.success(message).then(() => router.push("/users"));
      }
    } catch (error) {
      Alert.error(error.message);
    } finally {
      setSending(false);
    }
  };

  if (user?.role !== "ADMIN") {
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
          <h1 className="text-2xl font-medium">Edit user</h1>
        </div>
        {loading ? (
          <>Loading...</>
        ) : (
          <form onSubmit={handleSubmit(handleUpdate)}>
            <div className="w-1/2 mx-auto py-4">
              <div className="mb-4">
                <label>Username</label>
                <TextField disabled defaultValue={data?.username} {...register("username")} />
              </div>
              <div className="mb-4">
                <label>Phone</label>
                <TextField disabled defaultValue={data?.phone} {...register("phone")} />
              </div>
              <div className="mb-4">
                <label>Credit</label>
                <TextField
                  error={errors.credit}
                  {...register("credit", {
                    required: {
                      value: true,
                      message: "This field is required",
                    },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Incorrect data format",
                    },
                  })}
                  maxLength="5"
                  defaultValue={data?.credit}
                />
                {errors.credit ? <small className="text-error">{errors.credit.message}</small> : <></>}
              </div>
              <div className="mb-8">
                <label>Status</label>
                <div className="flex gap-10 mt-2">
                  <div className="inline-flex items-center">
                    <label className="relative flex items-center cursor-pointer" htmlFor="active">
                      <input
                        type="radio"
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-primary transition-all focus:outline-none"
                        id="active"
                        defaultChecked={data?.status === 1}
                        value={1}
                        {...register("status")}
                      />
                      <span className="absolute bg-primary w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
                    </label>
                    <label className="ml-2 text-slate-600 cursor-pointer text-sm" htmlFor="active">
                      Active
                    </label>
                  </div>
                  <div className="inline-flex items-center">
                    <label className="relative flex items-center cursor-pointer" htmlFor="pending">
                      <input
                        type="radio"
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-primary transition-all focus:outline-none"
                        id="pending"
                        defaultChecked={data?.status === 2}
                        value={2}
                        {...register("status")}
                      />
                      <span className="absolute bg-primary w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
                    </label>
                    <label className="ml-2 text-slate-600 cursor-pointer text-sm" htmlFor="pending">
                      Pending
                    </label>
                  </div>
                  <div className="inline-flex items-center">
                    <label className="relative flex items-center cursor-pointer" htmlFor="reject">
                      <input
                        type="radio"
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-primary transition-all focus:outline-none"
                        id="reject"
                        defaultChecked={data?.status === 3}
                        value={3}
                        {...register("status")}
                      />
                      <span className="absolute bg-primary w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
                    </label>
                    <label className="ml-2 text-slate-600 cursor-pointer text-sm" htmlFor="reject">
                      Reject
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="w-1/4 flex justify-center items-center mr-2" color="secondary" onClick={() => router.push("/users")} type="button">
                  <span className="mr-2">Cancel</span>
                  <LiaTimesSolid />
                </Button>
                <Button className="w-1/4 flex justify-center items-center mr-2" type="submit" disabled={sending}>
                  <span className="mr-2">Save</span>
                  <IoSaveOutline className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default withProtectedUser(EditUser);
