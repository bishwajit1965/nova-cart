import { useMutation, useQueryClient } from "@tanstack/react-query";

import apiService from "../api/apiService";
import toast from "react-hot-toast";

export const useApiMutation = ({
  method = "create",
  path,
  key,
  onSuccess,
  onError,
  showToast = true,
  successMessage, // string | function
}) => {
  const queryClient = useQueryClient();

  const mutationFn = async (payload) => {
    const url = typeof path === "function" ? path(payload) : path;
    if (method === "create") return apiService.create(url, payload?.data);
    if (method === "update") return apiService.update(url, payload?.data);
    if (method === "delete") return apiService.delete(url);
    throw new Error("Unsupported method");
  };

  return useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      if (key) {
        const queryKey = Array.isArray(key) ? key : [key];
        queryClient.invalidateQueries({ queryKey });
      }

      onSuccess?.(data);

      if (!showToast) return;

      const backendMessage = data?.message;

      //🧠 Dynamic message support
      const message =
        typeof successMessage === "function"
          ? successMessage({ data, variables, method })
          : successMessage ??
            backendMessage ??
            (method === "create"
              ? "Operation successful!"
              : method === "update"
              ? "Data updated successfully!"
              : "Data deleted successfully!");

      toast.success(message);
    },

    onError,
  });
};

//  ========> USAGE EXAMPLE ========>

// Using your hook
// const addProductMutation = useApiMutation({
//   method: "create",
//   path: API_PATHS.PRODUCTS.ENDPOINT,
//   key: API_PATHS.PRODUCTS.KEY, // this will invalidate cache after success
//   successMessage: "Product added successfully!",
// });

// const handleSubmit = (e) => {
//   e.preventDefault();
//   addProductMutation.mutate({ data: { title, price } });
// };

// ========> Using Dynamic Success Message ========>

//You can make the success message dynamic based on response or input:

// const mutation = useApiMutation({
//   method: "update",
//   path: (payload) => `/products/${payload.id}`,
//   key: API_PATHS.PRODUCTS.KEY,
//   successMessage: ({ variables }) => `Updated "${variables.data.title}" successfully!`,
// });

// ========> Handling Errors========>

//You can pass an onError callback to handle errors explicitly:
// const mutation = useApiMutation({
//   method: "delete",
//   path: (payload) => `/products/${payload.id}`,
//   onError: (error) => {
//     toast.error(error.response?.data?.message || "Something went wrong!");
//   },
// });

// DEMO MUTATION
// import React, { useState } from "react";
// import { useApiMutation } from "../hooks/useApiMutation";
// import API_PATHS from "../apiPaths/apiPaths";

// const DemoMutationUI = () => {
//   const [title, setTitle] = useState("");

//   // 1️⃣ Create Product - backend message used if exists
//   const createProduct = useApiMutation({
//     method: "create",
//     path: API_PATHS.PRODUCTS.ENDPOINT,
//     key: API_PATHS.PRODUCTS.KEY,
//   });

//   // 2️⃣ Update Product - custom success message
//   const updateProduct = useApiMutation({
//     method: "update",
//     path: (payload) => `${API_PATHS.PRODUCTS.ENDPOINT}/${payload.id}`,
//     key: API_PATHS.PRODUCTS.KEY,
//     successMessage: ({ variables }) => `Updated "${variables.data.title}" successfully!`,
//   });

//   // 3️⃣ Delete Product - fallback generic message
//   const deleteProduct = useApiMutation({
//     method: "delete",
//     path: (payload) => `${API_PATHS.PRODUCTS.ENDPOINT}/${payload.id}`,
//     key: API_PATHS.PRODUCTS.KEY,
//   });

//   return (
//     <div className="space-y-4 p-4">
//       <h2 className="text-xl font-bold">Mutation Demo</h2>

//       {/* Create */}
//       <div>
//         <input
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="Product Title"
//           className="border p-1 mr-2"
//         />
//         <button
//           onClick={() => createProduct.mutate({ data: { title } })}
//           disabled={createProduct.isLoading}
//           className="bg-blue-500 text-white px-2 py-1 rounded"
//         >
//           {createProduct.isLoading ? "Creating..." : "Create Product"}
//         </button>
//       </div>

//       {/* Update */}
//       <div>
//         <button
//           onClick={() =>
//             updateProduct.mutate({ id: "some-id", data: { title: "New Title" } })
//           }
//           disabled={updateProduct.isLoading}
//           className="bg-yellow-500 text-white px-2 py-1 rounded"
//         >
//           {updateProduct.isLoading ? "Updating..." : "Update Product"}
//         </button>
//       </div>

//       {/* Delete */}
//       <div>
//         <button
//           onClick={() => deleteProduct.mutate({ id: "some-id" })}
//           disabled={deleteProduct.isLoading}
//           className="bg-red-500 text-white px-2 py-1 rounded"
//         >
//           {deleteProduct.isLoading ? "Deleting..." : "Delete Product"}
//         </button>
//       </div>

//       {/* Error display */}
//       {(createProduct.isError || updateProduct.isError || deleteProduct.isError) && (
//         <p className="text-red-500">
//           Error:{" "}
//           {createProduct.error?.message ||
//             updateProduct.error?.message ||
//             deleteProduct.error?.message}
//         </p>
//       )}
//     </div>
//   );
// };

// export default DemoMutationUI;
