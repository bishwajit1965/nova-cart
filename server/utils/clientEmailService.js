import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((err, success) => {
  if (err) console.log("SMTP connection failed:", err);
  else console.log("SMTP ready to send messages!");
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Nova-Cart" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};

export const sendOrderConfirmationEmail = async ({
  userEmail,
  orderId,
  items,
  totalPrice,
}) => {
  // const itemsHtml = items
  //   .map(
  //     (item) =>
  //       `<li>${item.name} x ${item.quantity} - $${
  //         item.price * item.quantity
  //       }</li>`
  //   )
  //   .join("");

  const html = `
  <div style="font-family: Arial, sans-serif; color:#333; max-width:700px; margin:auto; background:#fff; border-radius:10px; overflow:hidden; border:1px solid #e5e7eb;">
    <!-- Header with logo and gradient -->
    <div style="background:linear-gradient(90deg,#4f46e5,#6366f1); padding:20px; text-align:center;">
      <img src="https://i.ibb.co.com/Q3s9YK8b/web-Dev-Pro-F.png" alt="Nova-Cart" style="height:50px;margin-bottom:10px;" />
       <h2 style="color:white;margin:0;font-size:25px">Nova Cart E-commerce</h2>
       <address style="color:white;text:bold;font-size:16px">
          37/A Dhanmondi-12,Dhaka,Bangladesh
       </address>
      <p style="color:white;text:bold;font-size:14px">${new Date()}</p>
    </div>

    <!-- Order details -->
    <div style="padding:20px;">
      <h2 style="color:black;margin:0;font-size:18px">Thank you for your order!</h2>
      <p>Order ID: <strong>${orderId}</strong></p>

      <table style="width:100%; border-collapse:collapse; margin-top:10px;">
        <tr style="background:#f3f4f6;">
          <th style="text-align:left; padding:8px;">Product</th>
          <th style="text-align:right; padding:8px;">Qty</th>
          <th style="text-align:right; padding:8px;">Price</th>
        </tr>
        ${items
          .map(
            (item) => `
          <tr>
            <td style="padding:8px;">${item.name}</td>
            <td style="padding:8px; text-align:right;">${item.quantity}</td>
            <td style="padding:8px; text-align:right;">$${(
              item.price * item.quantity
            ).toFixed(2)}</td>
          </tr>
        `
          )
          .join("")}
        <tr style="font-weight:bold; background:#f9fafb;">
          <td style="padding:8px;">Total</td>
          <td></td>
          <td style="padding:8px; text-align:right;">$${totalPrice}</td>
        </tr>
      </table>

      <p style="margin-top:15px;">We are processing your order and will notify you once it's shipped/delivered.</p>

      <div style="text-align:center; margin:20px 0;">
        <a href="https://novacart.com/orders" style="background:#4f46e5; color:white; padding:10px 20px; border-radius:5px; text-decoration:none;">View Your Order</a>
      </div>

      <p>Happy Shopping, <strong>Nova-Cart Team</strong></p>
    </div>

    <!-- Footer -->
    <div style="background:#f3f4f6; padding:10px; text-align:center; font-size:12px; color:#6b7280;">
      Follow us on:
      <a href="https://facebook.com/novacart" style="color:#4f46e5; text-decoration:none;">Facebook</a> |
      <a href="https://twitter.com/novacart" style="color:#4f46e5; text-decoration:none;">Twitter</a> |
      <a href="https://instagram.com/novacart" style="color:#4f46e5; text-decoration:none;">Instagram</a>
      <br/>
      Contact: support@novacart.com
    </div>
  </div>
`;

  await sendEmail({
    to: userEmail,
    subject: `Your Nova-Cart Order Confirmation #${orderId}`,
    html,
  });

  // const html = `
  // <!-- Header with logo and gradient -->
  //   <div style="background:linear-gradient(90deg,#4f46e5,#6366f1); padding:20px; text-align:center;">
  //     <img src="https://i.ibb.co.com/Q3s9YK8b/web-Dev-Pro-F.png" alt="Nova-Cart" style="height:50px; margin-bottom:10px;" />
  //     <h2 style="color:white; margin:0;">Nova Cart E-commerce</h2>
  //   <address style="color:white; font:bold">
  //   37/A Dhanmondi-12, Dhaka, Bangladesh
  //   </address>
  //   <p style="color:white; font: bold;">
  //   ${new Date()}
  //   </p>
  //   </div>
  //   <h2>Thank you for your order!</h2>
  //   <p>Order ID: <strong>${orderId}</strong></p>
  //   <ul>${itemsHtml}</ul>
  //   <p>Total: <strong>$${totalPrice}</strong></p>
  //   <p>We are processing your order and will notify you once it's shipped/delivered.</p>
  //   <p>Happy Shopping, <strong>Nova-Cart Team</strong></p>
  //   <!-- Footer -->
  //   <div style="background:#f3f4f6; padding:10px; text-align:center; font-size:12px; color:#6b7280;">
  //     Follow us on:
  //     <a href="https://facebook.com/novacart" style="color:#4f46e5; text-decoration:none;">Facebook</a> |
  //     <a href="https://twitter.com/novacart" style="color:#4f46e5; text-decoration:none;">Twitter</a> |
  //     <a href="https://instagram.com/novacart" style="color:#4f46e5; text-decoration:none;">Instagram</a>
  //     <br/>
  //     Contact: support@novacart.com
  //   </div>
  // `;

  // await sendEmail({
  //   to: userEmail, // <-- must be userEmail
  //   subject: `Your Nova-Cart Order Confirmation #${orderId}`,
  //   html,
  // });
};
