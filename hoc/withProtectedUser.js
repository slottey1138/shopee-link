import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { jwtVerify } from "jose";

const withProtectedUser = (WrappedComponent) => {
  const WithAuthComponent = (props) => {
    const { user, setUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
      async function loadUser() {
        try {
          const token = localStorage.getItem("token");
          if (token != null && token.length > 0) {
            const secretKey = Buffer.from(process.env.NEXT_PUBLIC_JWT_SECRET, "utf8");
            const { payload } = await jwtVerify(token, secretKey);

            if (payload.exp && Date.now() >= payload.exp * 1000) {
              localStorage.removeItem("token");
              setUser(null);
              router.push("/login");
            }

            setUser(payload);
          } else {
            setUser(null);
            localStorage.removeItem("token");
            router.push("/login");
          }
        } catch (error) {
          localStorage.removeItem("token");
          setUser(null);
          router.push("/login");
        }
      }
      loadUser();
    }, [router, setUser]);

    return user ? <WrappedComponent {...props} /> : <></>;
  };

  WithAuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return WithAuthComponent;
};

export default withProtectedUser;
