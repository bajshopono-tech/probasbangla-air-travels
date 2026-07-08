import { jsPDF } from "jspdf";

interface ReceiptData {
  title: string;
  pnr: string;
  passenger: string;
  phone?: string;
  passport?: string;
  service: string;
  price: string;
  date: string;
  status: string;
  additional?: Array<{ label: string; value: string }>;
}

export const downloadReceiptPdf = (data: ReceiptData) => {
  const width = 800;
  const height = 1120; // A4 aspect ratio 1 : 1.4
  
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  
  if (!ctx) return;
  
  // 1. Background
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, width, height);
  
  // Border & Frame
  ctx.strokeStyle = "#C9A84C";
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, width - 40, height - 40);
  
  ctx.strokeStyle = "#C9A84C";
  ctx.lineWidth = 1;
  ctx.strokeRect(26, 26, width - 52, height - 52);
  
  // 2. Corner Ornaments (elegant simple vector lines)
  const drawCorner = (x: number, y: number, dx: number, dy: number) => {
    ctx.strokeStyle = "#C9A84C";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y + dy * 30);
    ctx.lineTo(x, y);
    ctx.lineTo(x + dx * 30, y);
    ctx.stroke();
  };
  drawCorner(35, 35, 1, 1);
  drawCorner(width - 35, 35, -1, 1);
  drawCorner(35, height - 35, 1, -1);
  drawCorner(width - 35, height - 35, -1, -1);
  
  // 3. Watermark Logo in the center
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.fillStyle = "#C9A84C";
  ctx.beginPath();
  ctx.arc(width / 2, height / 2 + 50, 160, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  
  // 4. Header Text
  ctx.textAlign = "center";
  
  // English Header
  ctx.fillStyle = "#1E293B"; // Slate-800
  ctx.font = "bold 26px Arial, sans-serif";
  ctx.fillText("PROBASBANGLA AIR TRAVELS", width / 2, 85);
  
  // Bengali Header
  ctx.fillStyle = "#C9A84C"; // Gold
  ctx.font = "bold 22px Arial, sans-serif";
  ctx.fillText("প্রবাসবাংলা এয়ার ট্রাভেলস", width / 2, 120);
  
  // Subtitle / Contact
  ctx.fillStyle = "#475569"; // Slate-600
  ctx.font = "14px Arial, sans-serif";
  ctx.fillText("মতিঝিল প্লাজা (৪র্থ তলা), মতিঝিল বা/এ, ঢাকা-১০০০, বাংলাদেশ", width / 2, 150);
  ctx.fillText("হটলাইন: ০১৯৬২-৪০০০৯০ | ইমেইল: support@probasbangla.com", width / 2, 175);
  
  // Separator Line
  ctx.strokeStyle = "#C9A84C";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(50, 200);
  ctx.lineTo(width - 50, 200);
  ctx.stroke();
  
  // Receipt Title Banner
  ctx.fillStyle = "#1E293B"; // Slate-800
  ctx.fillRect(width / 2 - 220, 220, 440, 45);
  
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 18px Arial, sans-serif";
  ctx.fillText(data.title, width / 2, 248);
  
  // Receipt Metadata Grid / Table
  ctx.textAlign = "left";
  
  let currentY = 320;
  const drawRow = (label: string, value: string, isHighlighted = false) => {
    // Label
    ctx.fillStyle = "#475569"; // Slate-600
    ctx.font = "bold 15px Arial, sans-serif";
    ctx.fillText(label, 70, currentY);
    
    // Dot leader / separator line
    ctx.strokeStyle = "#E2E8F0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(270, currentY);
    ctx.lineTo(width - 70, currentY);
    ctx.stroke();
    
    // Value
    if (isHighlighted) {
      ctx.fillStyle = "#16A34A"; // Emerald-600
      ctx.font = "bold 16px Arial, sans-serif";
    } else {
      ctx.fillStyle = "#1E293B"; // Slate-800
      ctx.font = "15px Arial, sans-serif";
    }
    
    ctx.fillText(value, 280, currentY);
    currentY += 48;
  };
  
  drawRow("ট্র্যাকিং আইডি / PNR:", data.pnr);
  drawRow("আবেদনকারীর নাম (Name):", data.passenger);
  if (data.phone) {
    drawRow("মোবাইল নম্বর (Phone):", data.phone);
  }
  if (data.passport) {
    drawRow("পাসপোর্ট নম্বর (Passport):", data.passport);
  }
  drawRow("সেবার বিবরণ (Service):", data.service);
  drawRow("পেমেন্ট / মোট ফি (Fee):", data.price);
  drawRow("আবেদনের তারিখ (Date):", data.date);
  drawRow("বর্তমান অবস্থা (Status):", data.status, true);
  
  // If there is any additional dynamic context
  if (data.additional && data.additional.length > 0) {
    currentY += 15;
    ctx.fillStyle = "#1E293B";
    ctx.font = "bold 15px Arial, sans-serif";
    ctx.fillText("অন্যান্য তথ্য (Additional Information):", 70, currentY);
    currentY += 35;
    
    data.additional.forEach(item => {
      drawRow(item.label, item.value);
    });
  }
  
  // Seal / Sign block
  currentY = height - 190;
  
  // Left side signature
  ctx.strokeStyle = "#CBD5E1";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(70, currentY);
  ctx.lineTo(250, currentY);
  ctx.stroke();
  
  ctx.fillStyle = "#64748B";
  ctx.font = "12px Arial, sans-serif";
  ctx.fillText("গ্রাহকের স্বাক্ষর", 120, currentY + 20);
  
  // Right side official signature/seal
  ctx.beginPath();
  ctx.moveTo(width - 250, currentY);
  ctx.lineTo(width - 70, currentY);
  ctx.stroke();
  
  ctx.fillStyle = "#64748B";
  ctx.font = "12px Arial, sans-serif";
  ctx.fillText("অনুমোদিত কর্মকর্তার স্বাক্ষর", width - 210, currentY + 20);
  
  // Draw digital seal badge
  ctx.save();
  ctx.translate(width - 160, currentY - 50);
  ctx.rotate(-0.1);
  ctx.strokeStyle = "rgba(201, 168, 76, 0.7)";
  ctx.lineWidth = 2;
  ctx.strokeRect(-65, -20, 130, 35);
  ctx.fillStyle = "rgba(201, 168, 76, 0.8)";
  ctx.font = "bold 11px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("PROBASBANGLA", 0, -5);
  ctx.fillText("DIGITAL VERIFIED", 0, 10);
  ctx.restore();
  
  // Draw mock barcode
  const barcodeX = width / 2 - 120;
  const barcodeY = height - 110;
  ctx.fillStyle = "#000000";
  for (let i = 0; i < 40; i++) {
    const w = Math.floor(1 + (i % 3));
    ctx.fillRect(barcodeX + (i * 6), barcodeY, w, 30);
  }
  ctx.fillStyle = "#64748B";
  ctx.font = "bold 11px Courier, monospace";
  ctx.textAlign = "center";
  ctx.fillText(`*${data.pnr}*`, width / 2, barcodeY + 45);
  
  // Footer text
  ctx.fillStyle = "#94A3B8";
  ctx.font = "11px Arial, sans-serif";
  ctx.fillText("এটি একটি কম্পিউটার জেনারেটেড ডিজিটাল রসিদ এবং এর জন্য কোন সই বা সীল স্বাক্ষর বাধ্যতামূলক নয়।", width / 2, height - 35);
  
  // Generate PDF
  const imgData = canvas.toDataURL("image/jpeg", 1.0);
  const pdf = new jsPDF("p", "pt", "a4");
  
  // Get PDF dimensions
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  
  pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`probasbangla_receipt_${data.pnr}.pdf`);
};
