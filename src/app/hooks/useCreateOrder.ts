import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const createOrderURL =
  process.env.NEXT_PUBLIC_SUPABASE_EDGE_FUNCTION_CREATE_ORDER;

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: async (params: {
      shipping_address_id: string;
      items: { product_id: string; quantity: number }[];
    }) => {
      // Get token from supabase session
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!session || error) {
        throw new Error("Not authenticated");
      }

      const res = await fetch(createOrderURL as string, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(params),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");

      return data;
    },
  });
};
