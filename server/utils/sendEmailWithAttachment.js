import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { SMTP } from "../utils/constants.js";
dotenv.config();

export const sendEmailWithAttachment = async ({
  to,
  subject,
  text,
  attachments = [],
}) => {
  try {
    // 🔐 Use your own SMTP (Gmail or other)
    const transporter = nodemailer.createTransport({
      service: "gmail", // or use 'smtp' host, port if custom
      auth: {
        user: SMTP.EMAIL_USER, // example: your Gmail address
        pass: SMTP.EMAIL_PASS, // example: app password
      },
    });

    const mailOptions = {
      from: `"Nova-Cart" <${SMTP.EMAIL_USER}>`,
      to,
      subject,
      text,
      attachments, // e.g. [{ filename: 'invoice.pdf', content: pdfBuffer }]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📨 Email sent to ${to}: ${info.messageId}`);
    return true;
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
    return false;
  }
};

export default sendEmailWithAttachment;
