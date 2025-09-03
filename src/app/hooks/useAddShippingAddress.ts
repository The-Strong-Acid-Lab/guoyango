import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ShippingAddress } from "../manageAddresses/components/AddressForm";

export const useAddShippingAddress = (userId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (address: ShippingAddress) => {
      const finalUserId =
        userId ?? (await supabase.auth.getUser()).data.user?.id;
      if (!finalUserId) {
        throw new Error("No user ID available");
      }
      const { data, error } = await supabase
        .from("shipping_addresses")
        .upsert({ ...address, user_id: finalUserId });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shipping_addresses", userId ?? "me"],
      });
    },
  });
};
