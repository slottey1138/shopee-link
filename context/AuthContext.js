import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Alert from "@/utils/alerts.utils";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const login = async (params) => {
    try {
      const payload = {
        username: params.username,
        password: params.password,
      };
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, payload);

      if (res.status === 200) {
        const { token } = await res.data;
        localStorage.setItem("token", token);
        router.push("/dashboard");
      } else {
        Alert.error("Error");
      }
    } catch (error) {
      let response = error.response;
      const { message } = response.data;
      Alert.error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  // const checkAuth = async () => {
  //   const token = localStorage.getItem("token");
  //   if (!token) return;

  //   const res = await fetch("https://your-api.com/me", {
  //     headers: { Authorization: `Bearer ${token}` },
  //   });

  //   if (res.ok) {
  //     const data = await res.json();
  //     setUser(data.user);
  //   } else {
  //     logout();
  //   }
  // };

  // useEffect(() => {
  //   checkAuth();
  // }, []);

  return <AuthContext.Provider value={{ user, setUser, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
