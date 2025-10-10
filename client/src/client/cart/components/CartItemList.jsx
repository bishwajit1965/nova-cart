import { Minus, Plus } from "lucide-react";

import Button from "../../../common/components/ui/Button";
import { LucideIcon } from "../../../common/lib/LucideIcons";

const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const CartItemList = ({
  cart,
  handleIncreaseQuantity,
  handleDecreaseQuantity,
  onModalToggle,
  onSet,
}) => {
  console.log("CART DATA VIEW IN CART ITEM LIST", cart);

  if (!cart || cart.length === 0) {
    return <p className="text-center text-red-500">Your cart is empty</p>;
  }

  return (
    <div className="lg:space-y-4 space-y-2">
      {cart?.map((item) => (
        <div
          key={item.product._id}
          className="grid lg:grid-cols-12 grid-cols-1 items-center justify-between border border-base-content/15 p-3 shadow-sm rounded-lg lg:space-y-0 space-y-4"
        >
          <div className="lg:col-span-4 col-span-12 flex items-center gap-3">
            <img
              src={`${apiURL}${item?.product?.images[0]}`}
              alt={item.product.name}
              className="w-16 h-16 object-contain rounded"
            />
            <div>
              <h3 className="font-semibold">{item.product.name}</h3>
              <p className="text-sm text-gray-500">
                {item.product.description}
              </p>
              <p className="font-bold mt-1">${item.product.price.toFixed(2)}</p>
            </div>
          </div>

          <div className="lg:col-span-4 col-span-12 flex items-center justify-center gap-2">
            <button
              onClick={() => handleDecreaseQuantity(item.product._id)}
              className="btn btn-sm"
            >
              <Minus size={16} />
            </button>
            <span className="font-semibold">{item.quantity}</span>
            <button
              onClick={() => handleIncreaseQuantity(item.product._id)}
              className="btn btn-sm"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="lg:col-span-4 col-span-12 flex items-center justify-end gap-2">
            <span className="font-bold">
              ${(item.product.price * item.quantity).toFixed(2)}
            </span>
            <Button
              variant="danger"
              icon={LucideIcon.Trash2}
              onClick={() => {
                onModalToggle(item?.product?._id);
                onSet(item?.product?.name);
              }}
              className="btn btn-sm"
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartItemList;
