import { AlertTriangleIcon, LoaderIcon } from "lucide-react";

const useFetchedDataStatusHandler = ({ isLoading, isError, error, label }) => {
  if (isLoading) {
    return {
      status: "loading",
      content: (
        <div className="flex flex-col items-center gap-2 text-center lg:py-6 py-2 text-gray-600 animate-pulse">
          <div className="flex items-center justify-center lg:min-h-[calc(60vh-10px)]">
            <LoaderIcon className="w-6 h-6 animate-spin" />
            <p className="font-semibold space-x-2">Loading {label}...</p>
          </div>
        </div>
      ),
    };
  }

  if (isError) {
    return {
      status: "error",
      content: (
        <div className="flex flex-col items-center gap-2 text-center lg:p-10 p-2 text-reds-500 animate-fade-in border shadow-md border-base-content/15 rounded-md bg-base-300 hover:shadow-lg">
          <div className="lg:flex grid items-center justify-center lg:min-h-[calc(100vh-350px)] w-full rounded-md bg-base-200 shadow">
            <div className="bg-yellow-100 opacity-90 text-center lg:p-10 p-4 rounded-md border border-base-content/15 shadow space-y-2 text-red-600">
              <div className="flex justify-center">
                <AlertTriangleIcon className="w- h-" size={30} />
              </div>
              <div className="space-y-2">
                <h2 className="lg:text-2xl text-xl font-bold">
                  No data found ! Please check later.
                </h2>
                <p className="lg:text-2xl text-sm font-bold">
                  Error in loading {label}: {error?.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    };
  }

  return { status: "success", content: null };
};

export default useFetchedDataStatusHandler;

/**
 * This code defines a custom hook `useFetchedDataStatusHandler` that handles the loading, error, and success states of fetched data.
 * It returns an object with a status and content based on the current state of the data fetching operation.
 * The loading state shows a spinner and a loading message, the error state shows an error icon and message, and the success state returns null for content.
 * This hook can be used in components to manage the UI based on the data fetching status.
 */
/** ----> USE CASE IN COMPONENT IN MULTI DATA FETCHING ENVIRONMENT ----> */

// import React from "react";
// import useStatusHandler from "./hooks/useStatusHandler";
// import { useQuery } from "@tanstack/react-query";

// const Dashboard = () => {
//   // Fetch users
//   const { data: users, isLoading: isLoadingUsers, isError: isErrorUsers, error: errorUsers } = useQuery({
//     queryKey: ["users"],
//     queryFn: () => fetch("/api/users").then(res => res.json()),
//   });

//   // Fetch orders
//   const { data: orders, isLoading: isLoadingOrders, isError: isErrorOrders, error: errorOrders } = useQuery({
//     queryKey: ["orders"],
//     queryFn: () => fetch("/api/orders").then(res => res.json()),
//   });

//   // Fetch products
//   const { data: products, isLoading: isLoadingProducts, isError: isErrorProducts, error: errorProducts } = useQuery({
//     queryKey: ["products"],
//     queryFn: () => fetch("/api/products").then(res => res.json()),
//   });

//   // Use the hook for each fetch
//   const usersStatus = useFetchedDataStatusHandler({ isLoading: isLoadingUsers, isError: isErrorUsers, error: errorUsers, label: "users" });
//   const ordersStatus = useFetchedDataStatusHandler({ isLoading: isLoadingOrders, isError: isErrorOrders, error: errorOrders, label: "orders" });
//   const productsStatus = useFetchedDataStatusHandler({ isLoading: isLoadingProducts, isError: isErrorProducts, error: errorProducts, label: "products" });

//   return (
//     <div className="space-y-6">
//       {/* Users section */}
//       {usersStatus.status !== "success" ? usersStatus.content : (
//         <div>
//           <h2 className="font-bold text-lg">Users</h2>
//           <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
//         </div>
//       )}

//       {/* Orders section */}
//       {ordersStatus.status !== "success" ? ordersStatus.content : (
//         <div>
//           <h2 className="font-bold text-lg">Orders</h2>
//           <ul>{orders.map(o => <li key={o.id}>{o.productName} - {o.quantity}</li>)}</ul>
//         </div>
//       )}

//       {/* Products section */}
//       {productsStatus.status !== "success" ? productsStatus.content : (
//         <div>
//           <h2 className="font-bold text-lg">Products</h2>
//           <ul>{products.map(p => <li key={p.id}>{p.title}</li>)}</ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;
