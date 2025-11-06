import PDFDocument from "pdfkit";
import Portfolio from "../../models/Portfolio.js";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";

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

export default { getPortfolios, generatePortfolioPDF };
