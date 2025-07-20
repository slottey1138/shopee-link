import React from "react";
import withProtectedUser from "@/hoc/withProtectedUser";
import Layout from "@/components/includes/Layout";
import Button from "@/components/ui/Button";

const DailyProduct = () => {
  const extractLinks = () => {
    const jsonInput = document.getElementById("jsonInput").value;
    const linksOutput = document.getElementById("linksOutput");

    try {
      const jsonData = JSON.parse(jsonInput);
      const links = [];

      // Improved logic to traverse through feeds and ensure all items are extracted
      if (jsonData.feeds) {
        jsonData.feeds.forEach((feed) => {
          if (feed.item_card && feed.item_card.item) {
            const item = feed.item_card.item;
            const shopid = item.shopid;
            const itemid = item.itemid;

            if (shopid && itemid) {
              const link = `https://shopee.co.th/product/${shopid}/${itemid}`;
              links.push(link);
            }
          } else if (feed.ads_item_card && feed.ads_item_card.ads) {
            const ads = feed.ads_item_card.ads;
            const shopid = ads.shopid;
            const itemid = ads.itemid;

            if (shopid && itemid) {
              const link = `https://shopee.co.th/product/${shopid}/${itemid}`;
              links.push(link);
            }
          }
        });
      }

      linksOutput.value = links.join("\n");

      if (links.length === 0) {
        linksOutput.value = "No valid products found in the provided JSON.";
      }
    } catch (error) {
      linksOutput.value = "Invalid JSON input! Please check your data.";
    }
  };

  const copyLinks = () => {
    const linksOutput = document.getElementById("linksOutput");
    linksOutput.select();
    document.execCommand("copy");
    alert("Links copied to clipboard!");
  };

  return (
    <Layout>
      <div className="w-full min-h-24 bg-white p-4 rounded">
        <h1 className="text-3xl mb-4">JSON to Shopee Links</h1>
        <p>Paste your JSON data below and click "Extract Links" to generate Shopee product links.</p>

        <p id="dailyMessage">get_daily</p>

        <textarea id="jsonInput" placeholder="Paste your JSON here..." className="w-full border border-gray-200 min-h-48 focus:outline-none focus:border-primary p-2 rounded"></textarea>
        <Button onClick={() => extractLinks()} className="mr-2">
          Extract Links
        </Button>
        <Button onClick={() => copyLinks()}>Copy All Links</Button>

        <div class="output">
          <h2 className="text-xl font-medium mt-4">Extracted Links</h2>
          <textarea id="linksOutput" readonly placeholder="Links will appear here..." className="w-full border border-gray-200 min-h-48 focus:outline-none focus:border-primary p-2 rounded"></textarea>
        </div>
      </div>
    </Layout>
  );
};

export default withProtectedUser(DailyProduct);
