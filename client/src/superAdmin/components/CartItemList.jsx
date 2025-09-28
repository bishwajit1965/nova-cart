import { Minus, Plus } from "lucide-react";

import Button from "../../common/components/ui/Button";
import { LucideIcon } from "../../common/lib/LucideIcons";

const CartItemList = ({
  cart,
  handleIncreaseQuantity,
  handleDecreaseQuantity,
  handleRemoveItem,
}) => {
  if (!cart || cart.length === 0)
    return <p className="p-4">Your cart is empty. Go shopping!</p>;

  return (
    <div className="lg:p-4 p-2 rounded-xl bg-base-100 z-40">
      <div className="flex justify-between items-center border-b border-base-content/20 w-full lg:pb-4 pb-2">
        <div className=" ">
          <h2 className="lg:text-2xl text-lg font-bold">Nova-Cart</h2>
        </div>
        <div className="flex items-center space-x-4">
          <span>
            <LucideIcon.ShoppingCart size={34} />
          </span>
          <span>
            <Button variant="primary">CheckOut</Button>
          </span>
        </div>
      </div>
      <div className="min-h-64">
        <div className="lg:py-4 py-2">
          <h2 className="lg:text-2xl text-lg font-bold">Shopping Cart</h2>
        </div>

        <div className="overflow-x-auto">
          <table className=" table table-xs">
            <thead className=" ">
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Sub Total</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {(cart || []).length === 0 ? (
                <h2>No cart found</h2>
              ) : (
                (cart || []).map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <span className="flex items-center gap-3">
                        <span className="avatar">
                          <span className="mask mask-squircle lg:h-12 h-8 lg:w-12 w-8">
                            <img
                              src={item?.product?.image}
                              alt="Avatar Tailwind CSS Component"
                              className="w-12 h-12 object-cover rounded"
                            />
                          </span>
                        </span>
                        <span className="hidden lg:block">
                          <span className="text-lg font-bold">
                            {item?.product?.name}
                          </span>
                          <span className="text-xs font-bold">
                            {item?.product?.description}
                          </span>
                        </span>
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-ghost badge-sm lg:text-xl text-sm">
                        $ {item?.product?.price.toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <span className="flex items-center justify-between lg:space-x-4 space-x-2 border border-base-content/20 rounded-md shadow lg:px-4 py-1 m-1 lg:w-40">
                        <span
                          onClick={() =>
                            handleDecreaseQuantity(item?.product?._id)
                          }
                          className="lg:text-xl text-xs font-bold cursor-pointer"
                        >
                          {<Minus size={16} />}
                        </span>
                        <span className="lg:text-xl text-xs font-semibold rounded-full">
                          {item?.quantity}
                        </span>
                        <span
                          onClick={() =>
                            handleIncreaseQuantity(item?.product?._id)
                          }
                          className="lg:text-xl text-xs font-bold cursor-pointer"
                        >
                          {<Plus size={16} />}
                        </span>
                      </span>
                    </td>
                    <th>
                      <button className="btn btn-ghost btn-xs lg:text-xl text-sm">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </button>
                    </th>
                    <th>
                      <Button
                        onClick={() => handleRemoveItem(item.product._id)}
                        variant="danger"
                        className="btn btn-ghost btn-sm"
                      >
                        <LucideIcon.Trash2 size={16} />
                      </Button>
                    </th>
                  </tr>
                ))
              )}
            </tbody>

            <tfoot className="lg:text-md text-xs">
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Sub Total</th>
                <th>Remove</th>
              </tr>
            </tfoot>
          </table>
          <div className="divider"></div>
          <div className="lg:grid flex lg:grid-cols-12 grid-cols-1 lg:g-8 gap-0 justify-between items-center lg:my-10 my-5">
            <div className="lg:col-span-6 col-span-12">
              <Button
                variant="primary"
                icon={LucideIcon.ShoppingCart}
                className="btn lg:btn-lg btn-sm"
              >
                Continue Shopping
              </Button>
            </div>
            <div className="lg:col-span-6 col-span-12">
              <div className="lg:space-y-2">
                <div className="flex items-center justify-between">
                  <span>
                    <h2 className="lg:text-xl text-xs font-bold">
                      Total Items
                    </h2>
                  </span>
                  <span>
                    <h2 className="lg:text-xl text-xs font-bold">$156.00</h2>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <h2 className="lg:text-xl text-xs font-bold">Sub Total</h2>
                  <h2 className="lg:text-xl text-xs font-bold">$186.00</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemList;
