import React from "react";
import withProtectedUser from "@/hoc/withProtectedUser";
import Layout from "@/components/includes/Layout";
import Button from "@/components/ui/Button";

const DailyProduct = () => {
  function extractLinks(hasCommission) {
    const htmlInput = document.getElementById("html-input").value;
    const minSales = parseFloat(document.getElementById("min-sales").value) || 0;
    const maxSales = parseFloat(document.getElementById("max-sales").value) || Infinity;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlInput, "text/html");

    const items = doc.querySelectorAll(".shopee-search-item-result__item");
    const resultOutput = document.getElementById("result-output");
    resultOutput.innerHTML = "";

    items.forEach((item) => {
      const commissionImg = item.querySelector('img[alt="ams-label"], img[src*="ams-label"], img[src*="sponsored"], img[alt="shopee-partner"]');
      const isCommission = commissionImg !== null;

      if (isCommission === hasCommission) {
        const salesText = item.querySelector(".truncate.text-shopee-black87.text-xs.min-h-4")?.textContent || "";
        const salesMatch = salesText.match(/ขายได้\s([\d,.]+)([kพัน]*)\sชิ้น/);

        if (salesMatch) {
          let amount = parseFloat(salesMatch[1].replace(",", ""));
          if (salesMatch[2]?.includes("k") || salesMatch[2]?.includes("พัน")) amount *= 1000;

          if (amount >= minSales && amount <= maxSales) {
            const link = item.querySelector("a[href]");
            if (link) {
              const href = link.getAttribute("href");
              const match = href.match(/i\.(\d+)\.(\d+)/);
              if (match) {
                const shopid = match[1];
                const itemid = match[2];
                const productLink = `https://shopee.co.th/product/${shopid}/${itemid}`;
                const div = document.createElement("div");
                div.textContent = productLink;
                resultOutput.appendChild(div);
              }
            }
          }
        }
      }
    });
  }

  function extractCommissionLinks() {
    extractLinks(true);
  }

  function extractNonCommissionLinks() {
    extractLinks(false);
  }

  function copyAllLinks() {
    const resultOutput = document.getElementById("result-output");
    const links = Array.from(resultOutput.querySelectorAll("div"))
      .map((div) => div.textContent)
      .join("\n");
    navigator.clipboard
      .writeText(links)
      .then(() => alert("คัดลอกทั้งหมดสำเร็จ!"))
      .catch(() => alert("ไม่สามารถคัดลอกลิงค์ได้!"));
  }

  return (
    <Layout>
      <div className="w-full min-h-24 bg-white p-4 rounded">
        <h1 className="text-3xl mb-4">ดึงสินค้าตามใจ</h1>
        <div className="mb-10 shadow-xl border-l-4 border-primary p-6 rounded">
          <strong>วิธีใช้งาน:</strong>
          <ol>
            <li>
              1. คลิกขวาที่สินค้า เลือก <em>Inspect</em>
            </li>
            <li>
              2. ลิงค์สินค้าอยู่ในส่วน <code>ul class=</code>
            </li>
            <li>3. คลิกขวา Copy &gt; Copy element</li>
            <li>4. นำมาใส่ในกล่องข้อความและกดดึงสินค้า</li>
          </ol>
        </div>

        <textarea id="html-input" placeholder="วางโค้ด HTML ของสินค้า..." className="w-full border border-gray-200 min-h-48 focus:outline-none focus:border-primary p-2 rounded"></textarea>
        <div className="my-4">
          <input id="min-sales" className="border h-12 mr-2 rounded-md focus:outline-none px-2 transition duration-300 disabled:bg-gray-100" type="number" placeholder="ยอดขายขั้นต่ำ (ชิ้น)" />
          <input id="max-sales" className="border h-12 mr-2 rounded-md focus:outline-none px-2 transition duration-300 disabled:bg-gray-100" type="number" placeholder="ยอดขายสูงสุด (ชิ้น)" />
          <Button onClick={() => extractCommissionLinks()} className="mr-2">
            ดึงสินค้ามีค่าคอม
          </Button>
          <Button onClick={() => extractNonCommissionLinks()} className="mr-2">
            ดึงสินค้าไม่มีค่าคอม
          </Button>
          <Button onClick={() => copyAllLinks()}>คัดลอกลิงค์ทั้งหมด</Button>
        </div>
        <div class="min-h-[250px] bg-white w-full border border-gray-200 rounded-md mt-2" id="result-output"></div>
      </div>
    </Layout>
  );
};

export default withProtectedUser(DailyProduct);
