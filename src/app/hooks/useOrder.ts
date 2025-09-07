import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Order } from "../components/types";

export const useOrder = (userId?: string) => {
  return useQuery({
    queryKey: ["orders", userId ?? "me"],
    queryFn: async () => {
      const finalUserId =
        userId ?? (await supabase.auth.getUser()).data.user?.id;
      if (!finalUserId) throw new Error("No user ID available");

      const { data: orders, error } = await supabase
        .from("orders")
        .select(
          `
          id,
          total_amount,
          created_at,
          status,
          rate,
          total_amount_in_cny,
          payment_method,
          shipping_address:shipping_addresses (
            id,
            full_name,
            address_line_1,
            address_line_2,
            phone,
            province,
            city,
            postal_code,
            country
          ),
          order_items (
            id,
            quantity,
            price_each,
            total_price,
            product:products (
              id,
              name,
              image_url
            )
          )
        `
        )
        .eq("user_id", finalUserId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (orders as Order[]) || [];
    },
    enabled: !!userId || typeof window !== "undefined",
    staleTime: 0,
  });
};
