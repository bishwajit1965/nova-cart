import Button from "../../common/components/ui/Button";
import { LucideIcon } from "../../common/lib/LucideIcons";

const CartSummaryPanel = () => {
  return (
    <div className="lg:p-4 p-2 bg-base-100">
      <div className="flex justify-between items-center border-b border-base-content/20 w-full lg:pb-4 pb-2">
        <div className=" ">
          <h2 className="lg:text-2xl text-xl font-bold">Cart</h2>
        </div>
        <div className="flex items-center space-x-4">
          <span>
            <Button
              variant="primary"
              className="lg:btn-md btn-sm"
              icon={LucideIcon.CircleDollarSign}
            >
              Amount
            </Button>
          </span>
        </div>
      </div>
      <div className="lg:p-4 p-2 lg:space-y-6 space-y-2 lg:my-4 my-2">
        <div className="flex items-center justify-between space-x-2 border-b border-base-content/20 lg:pb-6 pb-3">
          <div className="lg:h-20 h-12 lg:w-20 w-12 bg-base-300 rounded-md">
            <img
              src="https://i.ibb.co.com/SRK3fGr/3-photo-camera-png-image-800x800.png"
              alt=""
              className="rounded-md shadow"
            />
          </div>
          <div className="">
            <h2 className="lg:text-xl text-sm font-bold">Blue T-Shirt</h2>
            <p className="lg:lg:text-xl text-sm font-bold">$51.50</p>
          </div>
        </div>

        <div className="flex items-center justify-between space-x-2 border-b border-base-content/20 lg:pb-6 pb-3">
          <div className="lg:h-20 h-12 lg:w-20 w-12 bg-base-300 rounded-md">
            <img
              src="https://i.ibb.co.com/DLCY4f4/Sony-UK.jpg"
              alt=""
              className="rounded-md shadow"
            />
          </div>
          <div className="">
            <h2 className="lg:text-xl text-sm font-bold">Blue T-Shirt</h2>
            <p className="lg:lg:text-xl text-sm font-bold">$51.50</p>
          </div>
        </div>

        <div className="flex items-center justify-between space-x-2 border-b border-base-content/20 lg:pb-6 pb-3">
          <div className="lg:h-20 h-12 lg:w-20 w-12 bg-base-300 rounded-md">
            <img
              src="https://i.ibb.co.com/4p0PDNB/head-phone.jpg"
              alt=""
              className="rounded-md shadow"
            />
          </div>
          <div className="">
            <h2 className="lg:text-xl text-sm font-bold">Blue T-Shirt</h2>
            <p className="lg:lg:text-xl text-sm font-bold">$51.50</p>
          </div>
        </div>

        <div className="flex items-center justify-between space-x-2 border-b border-base-content/20 lg:pb-6 pb-3">
          <div className="lg:h-20 h-12 lg:w-20 w-12 bg-base-300 rounded-md">
            <img
              src="https://i.ibb.co.com/hZzK4M0/apple-wrist-watch.jpg"
              alt=""
              className="rounded-md shadow"
            />
          </div>
          <div className="">
            <h2 className="lg:text-xl text-sm font-bold">Blue T-Shirt</h2>
            <p className="lg:lg:text-xl text-sm font-bold">$51.50</p>
          </div>
        </div>

        <div className="lg:space-y-4 space-y-2">
          <div className="flex justify-between items-center">
            <div className="">
              <h2 className="lg:text-xl text-sm font-bold">Total Items</h2>
            </div>
            <div className="lg:text-xl text-sm font-bold">$51.50</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="">
              <h2 className="lg:text-xl text-sm font-bold">Sub Total</h2>
            </div>
            <div className="lg:text-xl text-sm font-bold">$251.50</div>
          </div>
          <div className="divider"></div>
          <div className="lg:space-y-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="lg:text-xl text-sm font-extrabold">
                Grand Total
              </div>
              <div className="lg:text-xl text-sm font-extrabold">$500.00</div>
            </div>
            <div className="block w-full">
              <Button
                className="btn w-full lg:btn-lg btn-md"
                icon={LucideIcon.ShoppingCart}
              >
                Go to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummaryPanel;
