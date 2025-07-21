import React from "react";
import withProtectedUser from "@/hoc/withProtectedUser";
import Layout from "@/components/includes/Layout";
import Button from "@/components/ui/Button";

const DailyProduct = () => {
  function extractProductKeys() {
    const htmlInput = document.getElementById("html-input").value.trim();
    const resultOutput = document.getElementById("result-output");
    resultOutput.innerHTML = ""; // ล้างผลลัพธ์เก่า

    let numbers = [];

    try {
      // ตรวจสอบว่าเป็น JSON หรือไม่
      const jsonData = JSON.parse(htmlInput);
      if (Array.isArray(jsonData)) {
        numbers = jsonData.map((item) => item.itemId).filter(Boolean); // ดึงเฉพาะ itemId
      } else {
        throw new Error("JSON ไม่ถูกต้อง");
      }
    } catch (e) {
      // ใช้ Regular Expression เพื่อดึงตัวเลขในเครื่องหมายคำพูดจาก HTML
      const regex = /"(\d+)"/g;
      let match;
      while ((match = regex.exec(htmlInput)) !== null) {
        numbers.push(match[1]); // เก็บเฉพาะตัวเลข
      }
    }

    if (numbers.length === 0) {
      const noDataDiv = document.createElement("div");
      noDataDiv.textContent = "ไม่พบรหัสสินค้าในข้อมูลที่ใส่มา";
      resultOutput.appendChild(noDataDiv);
      return;
    }

    // แสดงผลลัพธ์
    numbers.forEach((number) => {
      const div = document.createElement("div");
      div.textContent = number;
      resultOutput.appendChild(div);
    });
  }

  function copyAllKeys() {
    const resultOutput = document.getElementById("result-output");

    // ดึงข้อความทั้งหมดจาก div ที่อยู่ใน result-output
    const keys = Array.from(resultOutput.querySelectorAll("div"))
      .map((div) => div.textContent.trim())
      .filter(Boolean) // กรองข้อความว่าง
      .join("\n");

    if (!keys) {
      alert("ไม่มีข้อมูลสำหรับคัดลอก!");
      return;
    }

    // คัดลอกข้อมูลไปยัง clipboard
    navigator.clipboard
      .writeText(keys)
      .then(() => {
        alert("คัดลอกสำเร็จ!");
      })
      .catch((err) => {
        console.error("การคัดลอกล้มเหลว:", err);
        alert("ไม่สามารถคัดลอกข้อมูลได้ กรุณาลองอีกครั้ง.");
      });
  }

  return (
    <Layout>
      <div className="w-full min-h-24 bg-white p-4 rounded">
        <h1 className="text-3xl mb-4">ดึงรหัสสินค้า</h1>
        <div className="instructions">
          <strong>วิธีใช้งาน:</strong>
          <ol>
            <li>- คัดลอกโค้ด HTML หรือ JSON ที่ต้องการ</li>
            <li>- วางในกล่องข้อความด้านล่าง</li>
            <li>- กดปุ่ม "ดึงรหัสสินค้า" เพื่อดึงรหัสสินค้าออกมา</li>
          </ol>
        </div>
        <textarea id="html-input" placeholder="วางโค้ด HTML หรือ JSON ที่นี่..." className="w-full border border-gray-200 min-h-48 focus:outline-none focus:border-primary p-2 rounded"></textarea>
        <div className="buttons">
          <Button onClick={() => extractProductKeys()} className="mr-2">
            ดึงรหัสสินค้า
          </Button>
          <Button onClick={() => copyAllKeys()}>คัดลอกทั้งหมด</Button>
        </div>
        <div className="output" id="result-output"></div>
      </div>
    </Layout>
  );
};

export default withProtectedUser(DailyProduct);
