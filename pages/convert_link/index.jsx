import React from "react";
import withProtectedUser from "@/hoc/withProtectedUser";
import Layout from "@/components/includes/Layout";
import Button from "@/components/ui/Button";

const DailyProduct = () => {
  const shortenLinks = () => {
    const longLinks = document.getElementById("longLinks").value.trim().split("\n");

    if (longLinks.length === 0 || longLinks[0] === "") {
      alert("Please enter some links to shorten.");
      return;
    }

    const shortenedLinks = longLinks.map((link) => {
      const regex = /https:\/\/shopee\.co\.th\/.*-i\.(\d+)\.(\d+)/;
      const match = link.match(regex);
      return match ? `https://shopee.co.th/product/${match[1]}/${match[2]}` : link;
    });

    const resultDiv = document.getElementById("result");
    resultDiv.style.display = "block";
    resultDiv.innerHTML = shortenedLinks.join("<br>");

    const copyButton = document.getElementById("copyButton");
    copyButton.style.display = "inline-block";

    alert(`Total Links Processed: ${longLinks.length}\nShortened Links: ${shortenedLinks.length}`);
  };

  const copyResults = () => {
    const resultDiv = document.getElementById("result");
    const text = resultDiv.innerText;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Results copied to clipboard!");
      })
      .catch((err) => {
        alert("Failed to copy results: " + err);
      });
  };

  return (
    <Layout>
      <div className="w-full min-h-24 bg-white p-4 rounded">
        <h2 className="text-3xl mb-4">Shorten Links</h2>
        <label htmlFor="longLinks">Enter Long Links:</label>
        <textarea
          id="longLinks"
          placeholder="Enter long links here (one per line, up to 1000 links)"
          className="w-full border border-gray-200 min-h-48 focus:outline-none focus:border-primary p-2 rounded"></textarea>

        <Button onclick={() => shortenLinks()}>Shorten Links</Button>

        <div id="result" class="result" style={{ display: "none" }}></div>
        <Button id="copyButton" style={{ display: "none" }} onclick={() => copyResults()}>
          Copy All Links
        </Button>
      </div>
    </Layout>
  );
};

export default withProtectedUser(DailyProduct);
