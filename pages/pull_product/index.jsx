import React from "react";
import withProtectedUser from "@/hoc/withProtectedUser";
import Layout from "@/components/includes/Layout";

const DailyProduct = () => {
  return (
    <Layout>
      <div className="w-full min-h-24 bg-white">Pull product</div>
    </Layout>
  );
};

export default withProtectedUser(DailyProduct);
