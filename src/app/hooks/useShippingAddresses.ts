import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useShippingAddresses = (userId?: string) => {
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
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId || typeof window !== "undefined",
    staleTime: 0,
  });
};
