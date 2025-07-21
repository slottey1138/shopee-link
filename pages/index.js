import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return <div></div>;
};

export default Home;
