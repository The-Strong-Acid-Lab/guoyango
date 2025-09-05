import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ShippingAddress } from "../manageAddresses/components/AddressForm";

export const useShippingAddress = (userId?: string) => {
  return useQuery({
    queryKey: ["shipping_addresses", userId ?? "me"],
    queryFn: async () => {
      const finalUserId =
        userId ?? (await supabase.auth.getUser()).data.user?.id;
      if (!finalUserId) throw new Error("No user ID available");

      const { data, error } = await supabase
        .from("shipping_addresses")
        .select("*")
        .eq("user_id", finalUserId)
        .order("is_default", { ascending: false });

      if (error) throw error;
      return (data as ShippingAddress[]) || [];
    },
    enabled: !!userId || typeof window !== "undefined",
    staleTime: 0,
  });
};
