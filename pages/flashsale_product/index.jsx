import React from "react";
import withProtectedUser from "@/hoc/withProtectedUser";
import Layout from "@/components/includes/Layout";
import Button from "@/components/ui/Button";

const DailyProduct = () => {
  function extractLinks() {
    const input = document.getElementById("jsonInput").value;
    const output = document.getElementById("linkOutput");
    output.textContent = ""; // Clear previous output

    try {
      const data = JSON.parse(input);
      const links = [];

      data.items.forEach((item) => {
        if (item && item.itemid && item.shopid) {
          links.push(`https://shopee.co.th/product/${item.shopid}/${item.itemid}`);
        }
      });

      output.textContent = links.length ? links.join("\n") : "ไม่พบลิงค์สินค้า";
    } catch (error) {
      output.textContent = "JSON ไม่ถูกต้อง";
    }
  }

  function copyLinks() {
    const output = document.getElementById("linkOutput");
    const text = output.textContent;

    if (text && text !== "ลิงค์สินค้าจะแสดงที่นี่..." && text !== "JSON ไม่ถูกต้อง") {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          alert("คัดลอกลิงค์ทั้งหมดเรียบร้อย!");
        })
        .catch(() => {
          alert("ไม่สามารถคัดลอกลิงค์ได้");
        });
    } else {
      alert("ไม่มีลิงค์ให้คัดลอก");
    }
  }

  return (
    <Layout>
      <div className="w-full min-h-24 bg-white p-4 rounded">
        <h1 className="text-3xl mb-4">ดึงสินค้าจาก FLASHSALE</h1>
        <h2>[flash_sale_batch_get_items]</h2>

        <textarea id="jsonInput" placeholder="กรอกโค้ด JSON ที่นี่..." className="w-full border border-gray-200 min-h-48 focus:outline-none focus:border-primary p-2 rounded"></textarea>
        <div className="output" id="linkOutput">
          ลิงค์สินค้าจะแสดงที่นี่...
        </div>
        <Button onClick={() => extractLinks()}>ดึงสินค้า</Button>
        <Button onClick={() => copyLinks()}>คัดลอกลิงค์ทั้งหมด</Button>
      </div>
    </Layout>
  );
};

export default withProtectedUser(DailyProduct);
