import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Product } from "../components/types";

export function useProductDetails(productId: string) {
  return useQuery<Product>({
    queryKey: ["productDetails", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId);
      if (error) throw error;
      return data[0];
    },
    staleTime: 60 * 60 * 1000,
  });
}
