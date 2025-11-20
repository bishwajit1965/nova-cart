import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const generateInvoiceFile = (order) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const dateStr = new Date(order.createdAt).toISOString().split("T")[0];
    const safeName = order.shippingAddress.fullName.replace(/[^a-z0-9]/gi, "_");
    const fileName = `Invoice_${order.orderId}_${safeName}_${dateStr}.pdf`;
    const filePath = path.join(process.cwd(), "tmp", fileName);

    // Ensure tmp folder exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // ========== HEADER ==========
    const logoPath = path.join(process.cwd(), "public/webDevProF.png");
    if (fs.existsSync(logoPath)) doc.image(logoPath, 50, 45, { width: 60 });

    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("Nova-Cart", 120, 50)
      .fontSize(10)
      .text("Nova-Cart E-Commerce", 120, 75)
      .text("support@novacart.com", 120, 90)
      .text("Phone: 01712323203, 01925412415", 120, 105)
      .text("Dhaka, Bangladesh", 120, 120)
      .text("Dhanmondi, 1230", 120, 135)
      .moveDown();

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("INVOICE", { underline: true })
      .moveDown();

    // ORDER INFO
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(`Order ID: ${order.orderId}`)
      .text(`Date: ${new Date(order.createdAt).toLocaleString()}`)
      .text(`Status: ${order.status}`)
      .moveDown();

    // CUSTOMER INFO
    const addr = order.shippingAddress;
    doc
      .text(`Customer: ${addr.fullName}`)
      .text(`Phone: ${addr.phone}`)
      .text(
        `Address: ${addr.addressLine1}, ${addr.addressLine2 || ""}, ${
          addr.city
        }, ${addr.postalCode}, ${addr.state}, ${addr.country}`
      )
      .moveDown();

    // ITEMS TABLE
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Items Purchased:", { underline: true })
      .moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(0.5);
    // Define column positions
    const tableTop = doc.y;
    const colProduct = 50;
    const colQty = 300;
    const colPrice = 370;
    const colTotal = 460;

    // Header
    doc.fontSize(12).font("Helvetica-Bold");
    doc.text("Product", colProduct, tableTop);
    doc.text("Qty", colQty, tableTop);
    doc.text("Price", colPrice, tableTop);
    doc.text("Total", colTotal, tableTop);
    doc.moveDown(0.5);

    // Divider
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);
    doc.font("Helvetica");
    order.items.forEach((item) => {
      const y = doc.y + 5;
      const price = item.price ?? item.product.price; // handle your data
      const total = (price * item.quantity).toFixed(2);
      doc.text(item.name ?? item.product.name, colProduct, y, { width: 200 });
      doc.text(item.quantity.toString(), colQty, y);
      doc.text(`$${price}`, colPrice, y);
      doc.text(`$${total}`, colTotal, y);
      doc.moveDown(0.5);
    });

    // TOTAL
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text(`Total Amount: $${order.totalAmount.toFixed(2)}`, {
        align: "left",
      });

    // FOOTER
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);
    doc
      .fontSize(10)
      .font("Helvetica")
      .text("Thank you for shopping with Nova-Cart!", { align: "left" });
    doc.text("This is a system-generated invoice.", { align: "left" });
    doc.end();
    stream.on("finish", () => resolve(filePath));
    stream.on("error", (err) => reject(err));
  });
};

export default generateInvoiceFile;
