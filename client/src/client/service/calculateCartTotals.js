/**
 * Plug-and-play variant-wise cart calculator
 * Safe, bulletproof, ready to use anywhere
 *
 * @param {Array} cart - Array of cart items from state or API
 * Each item: { productId, variantId?, price, quantity }
 * @returns {Object} { totalItems, subtotal, itemsByVariant }
 */
export function calculateCart(cart) {
  // Handle empty or invalid carts
  if (!Array.isArray(cart) || !cart.length)
    return { totalItems: 0, subtotal: 0, itemsByVariant: [] };

  // Aggregate variant-wise
  const map = new Map();

  cart.forEach((item) => {
    const key = `${item.productId}-${item.variantId || "default"}`;
    const qty = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    console.log("KEY", key);
    if (map.has(key)) {
      const existing = map.get(key);
      existing.quantity += qty;
      existing.subtotal += price * qty;
    } else {
      map.set(key, { ...item, quantity: qty, subtotal: price * qty });
    }
  });

  const itemsByVariant = Array.from(map.values());
  const totalItems = itemsByVariant.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal =
    Math.round(itemsByVariant.reduce((sum, i) => sum + i.subtotal, 0) * 100) /
    100;

  return { totalItems, subtotal, itemsByVariant };
}
