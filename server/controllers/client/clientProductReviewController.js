import Review from "../../models/Review.js";
import Product from "../../models/Product.js";

export const submitReview = async (req, res) => {
  console.log("🎯Submit review method is hit");
  const { productId, rating, comment } = req.body;
  const userId = req.user._id;
  console.log("REQ>BODY", req.body);
  if (!productId || !rating) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // 🔒 Prevent duplicate review
  const alreadyReviewed = await Review.findOne({
    product: productId,
    user: userId,
  });

  if (alreadyReviewed) {
    return res
      .status(400)
      .json({ message: "You already reviewed this product" });
  }

  // ✅ Create review
  const review = await Review.create({
    product: productId,
    user: userId,
    rating,
    comment,
  });
  console.log("Review created:", review._id); // this will confirm the insert
  // ⭐ Update product aggregates
  product.reviewsCount += 1;
  product.totalRatingSum += rating;
  product.rating = product.totalRatingSum / product.reviewsCount;

  await product.save();

  res.status(201).json({
    message: "Review submitted successfully",
    review,
  });
};

// Get reviews for a product
export const getReviewsByProductId = async (req, res) => {
  console.log("🎯 Get review by product Id method is hit");
  const { productId } = req.params;
  try {
    const reviews = await Review.find({
      product: productId,
    }).populate("user", "name email");
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getProductWithReviews = async (req, res) => {
  try {
    console.log("🎯 getProductWithReviews method is hit");
    const { productId } = req.params;

    // Fetch product and populate reviews
    const product = await Product.findById(productId).lean(); // lean() makes it a plain object

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    // Fetch reviews separately and populate user info
    const reviews = await Review.find({ product: productId })
      .populate("user", "name email") // fetch only name & email from User
      .sort({ createdAt: -1 }); // latest first

    return res.status(200).json({ success: true, ...product, data: reviews });
  } catch (error) {
    console.error("Error fetching product with reviews:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default {
  submitReview,
  getReviewsByProductId,
  getProductWithReviews,
};
