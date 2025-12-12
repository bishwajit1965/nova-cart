import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import useCart from "../../hooks/useGlobalContext";

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 w-[90%] sm:w-[400px] h-full bg-white z-50 shadow-xl p-4 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 120 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-bold">🛒 Your Cart</h2>
              <button onClick={onClose}>
                <X />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto mt-4 space-y-4">
              {cartItems.length === 0 ? (
                <p className="text-center text-gray-500">
                  Your cart is feeling lonely 😢
                </p>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.variantId}
                    className="flex gap-3 border-b pb-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      <p className="text-xs text-gray-500">
                        {item.color} | {item.size}
                      </p>
                      <p className="text-sm font-bold">
                        ${item.price} × {item.quantity}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.variantId)}
                      className="text-red-500 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t pt-4">
              <button className="w-full bg-black text-white py-2 rounded">
                Checkout →
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
