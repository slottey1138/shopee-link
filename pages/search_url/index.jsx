import React from "react";
import withProtectedUser from "@/hoc/withProtectedUser";
import Layout from "@/components/includes/Layout";
import Button from "@/components/ui/Button";

const DailyProduct = () => {
  return (
    <Layout>
      <div className="w-full min-h-24 bg-white p-4 rounded">
        <h2>Search URL by ID</h2>
        <label htmlFor="idInput">Enter ID:</label>
        <br />
        <textarea id="idInput" placeholder="Enter IDs here (one per line)" className="w-full border border-gray-200 min-h-48 focus:outline-none focus:border-primary p-2 rounded"></textarea>

        <label htmlFor="urlList">Enter URLs:</label>
        <br />
        <textarea id="urlList" placeholder="Enter URLs here (one per line)" className="w-full border border-gray-200 min-h-48 focus:outline-none focus:border-primary p-2 rounded"></textarea>

        <button onclick="searchURL()">Search</button>

        <div id="result" class="result" style={{ display: "none" }}></div>
        <Button id="copyButton" style={{ display: "none" }} onclick="copyLinks()">
          Copy All Links
        </Button>
      </div>
    </Layout>
  );
};

export default withProtectedUser(DailyProduct);
