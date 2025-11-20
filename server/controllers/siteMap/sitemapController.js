import Product from "../../models/Product.js";

export const getSitemap = async (req, res) => {
  try {
    const urls = [
      "/",
      "/product-categories",
      "/about-us",
      "/contact-us",
      "/privacy-policy",
      "/terms-and-conditions",
      "/frequently-asked-questions",
      "/shipping-and-returns",
    ];

    // Fetch all products from DB
    const products = await Product.find({}, "_id").lean();

    // Add product detail URLs
    products.forEach((p) => urls.push(`/product-details/${p._id}`));

    const domain = "https://yourdomain.com"; // Replace with your deployed domain
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map(
        (url) => `
    <url>
        <loc>${domain}${url}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`
      )
      .join("\n")}
    </urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating sitemap");
  }
};

export default { getSitemap };
