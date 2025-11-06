import PDFDocument from "pdfkit";
import Portfolio from "../../models/Portfolio.js";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";

export const generatePortfolioPDF = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio)
      return res.status(404).json({ message: "Portfolio not found" });

    const apiURL = process.env.BASE_URL || "http://localhost:3000";

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();

    // SUPER POLISHED HTML TEMPLATE
    const html = `
    <html>
    <head>
      <meta charset="utf-8"/>
      <style>
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          padding: 30px 50px;
          font-size: 13px;
          line-height: 1.55;
          color: #2f2f2f;
        }

        /* Name & Title */
        h1 {
          font-size: 30px;
          margin: 0;
          color: #1f1f1f;
          font-weight: 700;
        }

        h2 {
          margin: 0;
          font-size: 16px;
          margin-top: 4px;
          color: #555;
          font-weight: 500;
        }

        h3 {
          font-size: 17px;
          color: #1a1a1a;
          margin-top: 32px;
          margin-bottom: 8px;
          padding-bottom: 6px;
          border-bottom: 1px solid #d0d0d0;
          letter-spacing: 0.2px;
        }

        .profile {
          display: flex;
          gap: 24px;
          margin-top: 25px;
        }

        .profile img {
          width: 125px;
          height: 125px;
          border-radius: 10px;
          object-fit: cover;
          border: 2px solid #e0e0e0;
          box-shadow: 0 3px 8px rgba(0,0,0,0.15);
        }

        .info p {
          margin: 3px 0;
          font-size: 13px;
        }

        ul {
          padding-left: 18px;
          margin: 6px 0 12px 0;
        }

        li {
          margin-bottom: 6px;
        }

        .section-block {
          margin-bottom: 14px;
        }

      </style>
    </head>

    <body>

      <!-- Top Profile Section -->
      <div class="profile">
        ${
          portfolio.profileImage
            ? `<img src="${apiURL}${portfolio.profileImage}" alt="profile-image" />`
            : ""
        }

        <div>
          <h1>${(portfolio.name || "Developer").replace(/</g, "&lt;")}</h1>
          <h2>${(portfolio.title || "").replace(/</g, "&lt;")}</h2>

          <div class="info">
            <p>Email: ${(portfolio.email || "").replace(/</g, "&lt;")}</p>
            <p>Phone: ${(portfolio.phone || "").replace(/</g, "&lt;")}</p>
            <p>Location: ${(portfolio.location || "").replace(/</g, "&lt;")}</p>
          </div>
        </div>
      </div>

      <!-- Bio -->
      <h3>Bio</h3>
      <p class="section-block">${(portfolio.bio || "").replace(
        /</g,
        "&lt;"
      )}</p>

      <!-- Skills -->
      <h3>Skills</h3>
      <ul class="section-block">
        ${(portfolio.skills || [])
          .map((s) => `<li>${String(s).replace(/</g, "&lt;")}</li>`)
          .join("")}
      </ul>

      <!-- Projects -->
      <h3>Projects</h3>
      <ul class="section-block">
        ${(portfolio.projects || [])
          .map(
            (p) => `
            <li>
              <strong>${String(p.name || "").replace(
                /</g,
                "&lt;"
              )}</strong> — ${String(p.description || "").replace(
              /</g,
              "&lt;"
            )}<br>
              <span style="font-size:12px; color:#555;">Tech: ${(
                p.techStack || []
              )
                .map((ts) => String(ts).replace(/</g, "&lt;"))
                .join(", ")}</span><br>
              <span style="font-size:12px;">${String(p.link || "").replace(
                /</g,
                "&lt;"
              )}</span>
            </li>`
          )
          .join("")}
      </ul>

      <!-- Experience -->
      <h3>Experience</h3>
      <ul class="section-block">
        ${(portfolio.experience || [])
          .map(
            (e) => `
            <li>
              <strong>${String(e.role || "").replace(
                /</g,
                "&lt;"
              )}</strong>, ${String(e.company || "").replace(/</g, "&lt;")}<br>
              <span style="font-size:12px; color:#555;">${String(
                e.startDate || ""
              ).replace(/</g, "&lt;")} - ${String(e.endDate || "").replace(
              /</g,
              "&lt;"
            )}</span><br>
              ${String(e.description || "").replace(/</g, "&lt;")}
            </li>`
          )
          .join("")}
      </ul>

      <!-- Education -->
      <h3>Education</h3>
      <ul class="section-block">
        ${(portfolio.education || [])
          .map(
            (ed) => `
            <li>
              <strong>${String(ed.degree || "").replace(
                /</g,
                "&lt;"
              )}</strong> — ${String(ed.institute || "").replace(
              /</g,
              "&lt;"
            )}<br>
              <span style="font-size:12px; color:#555;">${String(
                ed.startYear || ""
              ).replace(/</g, "&lt;")} - ${String(ed.endYear || "").replace(
              /</g,
              "&lt;"
            )}</span><br>
              ${String(ed.description || "").replace(/</g, "&lt;")}
            </li>`
          )
          .join("")}
      </ul>

      <!-- Achievements -->
      <h3>Achievements</h3>
      <ul class="section-block">
        ${(portfolio.achievements || [])
          .map((a) => `<li>${String(a).replace(/</g, "&lt;")}</li>`)
          .join("")}
      </ul>

    </body>
    </html>
    `;

    await page.setContent(html, { waitUntil: "networkidle0" });

    // POLISHED PDF SETTINGS (no syntax errors)
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      margin: {
        top: "85px",
        bottom: "60px",
        left: "50px",
        right: "50px",
      },
      headerTemplate: `
        <div style="font-size:11px; padding:14px 20px; width:100%; text-align:left;">
          <strong style="font-size:17px;">${String(
            portfolio.name || " "
          ).replace(/</g, "&lt;")}</strong>
          <hr style="border:0; border-bottom:1px solid #ccc; margin-top:10px;">
        </div>
      `,
      footerTemplate: `
        <div style="font-size:11px; text-align:center; width:100%; padding:10px; color:#555;">
          Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>
      `,
    });

    await browser.close();

    const filename = `${(portfolio.name || "portfolio").replace(
      /[^a-z0-9_\-\.]/gi,
      "_"
    )}.pdf`;

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
    });

    return res.send(pdfBuffer);
  } catch (err) {
    console.error("PDF Error:", err);
    return res
      .status(500)
      .json({ message: "Failed to generate PDF", error: err.message });
  }
};

// const buildPdfFromPortfolio = (doc, p) => {
//   const pageWidth = doc.page.width;
//   const margin = 50;

//   // Header function
//   const addHeader = () => {
//     if (p.profileImage) {
//       const imagePath = path.join(process.cwd(), p.profileImage); // Correct uploads path
//       if (fs.existsSync(imagePath)) {
//         doc.image(imagePath, margin, 40, { width: 60, height: 60 });
//       }
//     }

//     doc
//       .fontSize(20)
//       .text(p.name || "No Name", margin + 70, 50, { align: "left" });

//     if (p.title) doc.fontSize(12).text(p.title, { align: "left" });

//     doc.moveDown(1);

//     doc
//       .moveTo(margin, 110)
//       .lineTo(pageWidth - margin, 110)
//       .stroke(); // underline
//     doc.moveDown(2);
//   };

//   // Footer with page number
//   const addFooter = () => {
//     const range = doc.bufferedPageRange(); // { start: 0, count: n }
//     for (let i = range.start; i < range.start + range.count; i++) {
//       doc.switchToPage(i);
//       doc
//         .fontSize(8)
//         .text(`Page ${i + 1} of ${range.count}`, 0, doc.page.height - 40, {
//           align: "center",
//         });
//     }
//   };

//   // Start PDF content
//   addHeader();

//   // Bio
//   if (p.bio) {
//     doc.fontSize(10).text(p.bio, { align: "left" });
//     doc.moveDown(0.5);
//   }

//   // Contact
//   const contact = [];
//   if (p.email) contact.push(`✉️ ${p.email}`);
//   if (p.phone) contact.push(`☎️ ${p.phone}`);
//   if (p.location) contact.push(`📍 ${p.location}`);
//   if (contact.length) doc.fontSize(10).text(contact.join(" • "));
//   doc.moveDown(0.6);

//   // Skills
//   if (p.skills?.length) {
//     doc.fontSize(12).text("Skills:", { underline: true });
//     doc.fontSize(10).text(p.skills.join(", "));
//     doc.moveDown(0.5);
//   }

//   // Experience
//   if (p.experience?.length) {
//     doc.fontSize(12).text("Experience:", { underline: true });
//     p.experience.forEach((e) => {
//       doc
//         .fontSize(11)
//         .text(
//           `${e.role} — ${e.company} (${e.startDate || ""} - ${e.endDate || ""})`
//         );
//       if (e.description) doc.fontSize(10).text(e.description);
//       doc.moveDown(0.2);
//     });
//     doc.moveDown(0.3);
//   }

//   // Education
//   if (p.education?.length) {
//     doc.fontSize(12).text("Education:", { underline: true });
//     p.education.forEach((ed) => {
//       doc
//         .fontSize(11)
//         .text(
//           `${ed.degree || ""} — ${ed.institute} (${ed.startYear || ""} - ${
//             ed.endYear || ""
//           })`
//         );
//       if (ed.description) doc.fontSize(10).text(ed.description);
//       doc.moveDown(0.2);
//     });
//   }

//   // Projects
//   if (p.projects?.length) {
//     doc.fontSize(12).text("Projects:", { underline: true });
//     p.projects.forEach((proj) => {
//       doc
//         .fontSize(11)
//         .text(`${proj.name} ${proj.link ? `— ${proj.link}` : ""}`);
//       if (proj.description) doc.fontSize(10).text(proj.description);
//       if (proj.techStack?.length)
//         doc.fontSize(10).text(`Tech: ${proj.techStack.join(", ")}`);
//       doc.moveDown(0.2);
//     });
//   }

//   // Achievements
//   if (p.achievements?.length) {
//     doc.addPage();
//     addHeader();
//     doc.fontSize(16).text("Achievements & Awards", { underline: true });
//     doc.moveDown(0.3);
//     p.achievements.forEach((a) => doc.fontSize(10).list([a]));
//   }

//   // Footer with page numbers
//   addFooter();
// };

export const createPortfolio = async (req, res) => {
  try {
    const payload = req.body;

    // 🧠 Smart parser to handle both JSON and FormData
    const parseMaybeJSON = (value) => {
      try {
        return typeof value === "string" ? JSON.parse(value) : value;
      } catch {
        return value;
      }
    };

    // 🧩 Fix nested fields that may come as JSON strings
    payload.education = parseMaybeJSON(payload.education);
    payload.experience = parseMaybeJSON(payload.experience);
    payload.projects = parseMaybeJSON(payload.projects);
    payload.skills = parseMaybeJSON(payload.skills);
    payload.achievements = parseMaybeJSON(payload.achievements);
    payload.socialLinks = parseMaybeJSON(payload.socialLinks);

    if (
      payload.profileImage === "null" ||
      payload.profileImage === "" ||
      payload.profileImage === undefined
    ) {
      payload.profileImage = null;
    }

    // 🖼️ Handle profile image if file uploaded
    if (req.file) {
      payload.profileImage = `/uploads/${req.file.filename}`;
    }

    const portfolio = new Portfolio(payload);
    console.log("🎯Portfolio", portfolio);
    await portfolio.save();

    res.status(201).json({
      success: true,
      message: "Portfolio created successfully!",
      data: portfolio,
    });
  } catch (error) {
    console.error("Error creating portfolio:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create portfolio",
      error: error.message,
    });
  }
};

export const getPortfolios = async (req, res) => {
  try {
    const q = {};
    if (req.query.publicOnly === "true") q.isPublic = true;
    const portfolios = await Portfolio.find(q).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Portfolio fetched successfully!",
      data: portfolios,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params._id);
    if (!portfolio)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: portfolio });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updatePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const parseMaybeJSON = (value) => {
      try {
        return typeof value === "string" ? JSON.parse(value) : value;
      } catch {
        return value;
      }
    };

    payload.education = parseMaybeJSON(payload.education);
    payload.experience = parseMaybeJSON(payload.experience);
    payload.projects = parseMaybeJSON(payload.projects);
    payload.skills = parseMaybeJSON(payload.skills);
    payload.achievements = parseMaybeJSON(payload.achievements);
    payload.socialLinks = parseMaybeJSON(payload.socialLinks);

    if (
      payload.profileImage === "null" ||
      payload.profileImage === "" ||
      payload.profileImage === undefined
    ) {
      payload.profileImage = null;
    }

    if (req.file) {
      payload.profileImage = `/uploads/${req.file.filename}`;
    }

    const updated = await Portfolio.findByIdAndUpdate(id, payload, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Portfolio updated successfully!",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating portfolio:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update portfolio",
      error: error.message,
    });
  }
};

export const deletePortfolio = async (req, res) => {
  try {
    const removed = await Portfolio.findByIdAndDelete(req.params.id);
    if (!removed)
      return res.status(404).json({ success: false, message: "Not found" });
    // Optionally delete the profile image file from disk if stored locally
    if (removed.profileImage && removed.profileImage.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), removed.profileImage);
      fs.unlink(filePath, (e) => {
        if (e) console.warn("Could not delete file", e.message);
      });
    }
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// export const generatePdf = async (req, res) => {
//   try {
//     const portfolio = await Portfolio.findById(req.params.id);
//     if (!portfolio)
//       return res.status(404).json({ success: false, message: "Not found" });

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename="${(portfolio.name || "resume").replace(
//         /\s+/g,
//         "_"
//       )}.pdf"`
//     );

//     const doc = new PDFDocument({ size: "A4", margin: 50, bufferPages: true });
//     doc.pipe(res);

//     buildPdfFromPortfolio(doc, portfolio);

//     doc.end();
//   } catch (err) {
//     console.error(err);
//     if (!res.headersSent)
//       res.status(500).json({ success: false, message: "Server error" });
//   }
// };

export default {
  createPortfolio,
  getPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
  // generatePdf,
  generatePortfolioPDF,
};
