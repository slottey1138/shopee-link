import React from "react";
import withProtectedUser from "@/hoc/withProtectedUser";
import Layout from "@/components/includes/Layout";
import Button from "@/components/ui/Button";

const DailyProduct = () => {
  const searchURL = () => {
    const id = document.getElementById("idInput").value.trim();
    const urlList = document.getElementById("urlList").value.trim().split("\n");

    if (!id) {
      document.getElementById("result").style.display = "none";
      document.getElementById("copyButton").style.display = "none";
      alert("Please enter an ID.");
      return;
    }

    const ids = id
      .split("\n")
      .map((i) => i.trim())
      .filter((i) => i !== "");
    const matchedURLs = urlList.filter((url) => ids.some((id) => url.includes(id)));

    const resultDiv = document.getElementById("result");

    if (matchedURLs.length > 0) {
      resultDiv.style.display = "block";
      document.getElementById("copyButton").style.display = "inline-block";
      resultDiv.innerHTML = matchedURLs.join("<br>");
    } else {
      resultDiv.style.display = "block";
      document.getElementById("copyButton").style.display = "none";
      resultDiv.innerHTML = "No URLs matched the given ID.";
    }
  };

  const copyLinks = () => {
    const resultDiv = document.getElementById("result");
    const text = resultDiv.innerText;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Links copied to clipboard!");
      })
      .catch((err) => {
        alert("Failed to copy links: " + err);
      });
  };

  return (
    <Layout>
      <div className="w-full min-h-24 bg-white p-4 rounded">
        <h2 className="text-3xl mb-4">Search URL by ID</h2>
        <label htmlFor="idInput">Enter ID:</label>
        <br />
        <textarea id="idInput" placeholder="Enter IDs here (one per line)" className="w-full border border-gray-200 min-h-48 focus:outline-none focus:border-primary p-2 rounded"></textarea>

        <label htmlFor="urlList">Enter URLs:</label>
        <br />
        <textarea id="urlList" placeholder="Enter URLs here (one per line)" className="w-full border border-gray-200 min-h-48 focus:outline-none focus:border-primary p-2 rounded"></textarea>

        <Button onClick={() => searchURL()} className="mb-2">
          Search
        </Button>

        <div id="result" class="result" style={{ display: "none" }} className="mb-2"></div>
        <Button id="copyButton" style={{ display: "none" }} onClick={() => copyLinks()}>
          Copy All Links
        </Button>
      </div>
    </Layout>
  );
};

export default withProtectedUser(DailyProduct);
