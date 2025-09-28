import { useMutation, useQueryClient } from "@tanstack/react-query";

import api from "../../lib/api";

export const useApiDelete = ({ url, key, onSuccess, onError }) => {
  const queryClient = useQueryClient();

  const mutationFn = async ({ id }) => {
    return api.delete(`${url}/${id}`).then((res) => res.data);
  };

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: Array.isArray(key) ? key : [key],
      });
      if (onSuccess) onSuccess(data);
    },
    onError,
  });
};
