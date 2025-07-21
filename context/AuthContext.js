import { createContext, useContext, useState } from "react";
import { useRouter } from "next/router";
import axios from "@/utils/api.utils";
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

  return <AuthContext.Provider value={{ user, setUser, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
