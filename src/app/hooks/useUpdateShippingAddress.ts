import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ShippingAddress } from "../manageAddresses/components/AddressForm";

export const useUpdateShippingAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...rest }: Partial<ShippingAddress>) => {
      const { error } = await supabase
        .from("shipping_addresses")
        .update({ ...rest })
        .eq("id", id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shipping_addresses"],
      });
    },
  });
};
