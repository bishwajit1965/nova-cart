import { useMutation, useQueryClient } from "@tanstack/react-query";

import apiService from "../api/apiService";
import toast from "react-hot-toast";

export const useApiMutation = ({
  method = "create",
  path,
  key,
  onSuccess,
  onError,
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
    onSuccess: (data) => {
      if (key) {
        const queryKey = Array.isArray(key) ? key : [key];
        queryClient.invalidateQueries({ queryKey });
        queryClient.refetchQueries({ queryKey, exact: true });
      }
      onSuccess?.(data);
      method === "create"
        ? toast.success("Data Created successfully!")
        : method === "update"
        ? toast.success("Data Updated successfully!")
        : toast.success("Data Deleted successfully!");
    },
    onError,
  });
};
