import { getSitemap } from "../controllers/siteMap/sitemapController.js";

import express from "express";

const router = express.Router();

router.get("/sitemap.xml", getSitemap);

export default router;
