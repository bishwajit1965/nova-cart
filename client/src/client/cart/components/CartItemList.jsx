import { CircleMinus, CirclePlus, Minus, Plus, Trash2 } from "lucide-react";

import Button from "../../../common/components/ui/Button";
import { LucideIcon } from "../../../common/lib/LucideIcons";
import NoDataFound from "../../../common/components/ui/NoDataFound";
import ConfirmModal from "../../../common/components/ui/ConfirmModal";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const CartItemList = ({
  cart,
  handleIncreaseQuantity,
  handleDecreaseQuantity,

  deleteModalData,
  onDeleteRequest,
  onDelete,
  setDeleteModalData,
}) => {
  if (!cart || cart.length === 0) {
    return <NoDataFound label="Cart item" />;
  }

  const navigate = useNavigate();

  const handleNavigate = (item) => {
    const product = item?.product;
    if (!product) {
      toast.error("Product not found!");
      return;
    }

    const variants = product.variants || [];

    let variantId = item.variantId || null;

    // Auto-pick if single variant exists and no variantId provided
    if (!variantId && variants.length === 1) {
      variantId = variants[0]._id;
    }

    navigate(`/product-details/${product._id}`, {
      state: { from: "cart", variantId },
    });
  };

  return (
    <>
      <div className="p-2 sticky top-0 bg-base-300 rounded-t-lg border border-base-content/15">
        <h2 className="lg:text-xl text-lg font-extrabold flex items-center justify-between gap-2 text-base-content/70">
          <span className="flex items-center space-x-2">
            <CirclePlus className="text-indigo-500" />
            <CircleMinus className="text-green-500" />
            <Trash2 className="text-red-500" /> ➡️
          </span>
          <span className="items-center hidden lg:block">
            🛒 Manage Cart Items
          </span>
          <span className="lg:hidden block text-xs">Inc / Dec / Del</span>
          <span className="w-7 h-7 rounded-full bg-indigo-500 flex justify-center items-center text-white shadow text-sm">
            {cart.length}
          </span>
        </h2>
      </div>
      <div className="lg:space-y-4 space-y-2 lg:max-h-[18.5rem] max-h-[11.2rem] overflow-y-auto bg-base-100 rounded-b-lg py-2">
        {cart?.map((item) => {
          const selectedVariant = item?.product?.variants?.find(
            (variant) => String(variant?._id) === String(item?.variantId),
          );

          const displayImage =
            selectedVariant?.images?.length > 0
              ? selectedVariant?.images[0]
              : item?.product?.images?.[0];

          const basePrice = selectedVariant?.price ?? item?.price;

          const discount =
            selectedVariant?.discountPrice ?? item?.discountPrice ?? 0;

          const finalPrice = basePrice - discount;

          return (
            <div
              key={`${item?.product?._id}${item?.variantId || "no-variant"}`}
              // key={item.product._id}
              className="grid lg:grid-cols-12 grid-cols-1 items-center justify-between border border-base-content/15 p-2 shadow-sm rounded-lg lg:space-y-0 space-y-4 cursor-pointer"
            >
              <div className="lg:col-span-4 col-span-12 flex items-center gap-3 text-xs">
                <img
                  onClick={() => handleNavigate(item)}
                  src={`${apiURL}${displayImage}`}
                  alt={item?.product?.name}
                  className="w-16 h-16 object-contain rounded"
                />
                <div className="text-sm">
                  <h3
                    onClick={() => handleNavigate(item)}
                    className="text-xs font-bold"
                  >
                    {item?.product?.name}
                  </h3>

                  <p className="font-bold mt-1">
                    <span className="text-sm">
                      $
                      {basePrice?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    ?
                  </p>
                </div>
              </div>

              <div className="lg:col-span-4 col-span-12 flex items-center justify-center gap-2">
                <button
                  onClick={() =>
                    handleDecreaseQuantity(item?.product?._id, item?.variantId)
                  }
                  className="btn btn-sm"
                >
                  <Minus size={16} />
                </button>
                <span className="font-semibold">{item?.quantity}</span>
                <button
                  onClick={() =>
                    handleIncreaseQuantity(item.product._id, item.variantId)
                  }
                  className="btn btn-sm"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="lg:col-span-4 col-span-12 flex items-center justify-end gap-2">
                <span className="text-sm font-bold">
                  $
                  {(basePrice * item?.quantity).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>

                <Button
                  variant="danger"
                  icon={LucideIcon.Trash2}
                  onClick={() => onDeleteRequest(item)}
                  size="xs"
                  label="Remove"
                  className=""
                />
              </div>
            </div>
          );
        })}

        {/* DELETE CONFIRM MODAL */}
        {deleteModalData && (
          <ConfirmModal
            isOpen={!!deleteModalData}
            deleteIdToken={deleteModalData}
            title="Remove item from cart?"
            alertMessage="Are you sure of deleting this item?"
            message={
              <span className="font-semibold text-red-600 italic">
                ➡️ {deleteModalData?.product?.name} ➡️ $
                {deleteModalData?.product?.price.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </span>
            }
            cancelText="Keep"
            onConfirm={() =>
              onDelete({
                productId: deleteModalData.product._id,
                variantId: deleteModalData.variantId ?? null,
              })
            }
            onCancel={() => setDeleteModalData(null)}
          />
        )}
      </div>
    </>
  );
};

export default CartItemList;
