import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Product } from "../components/types";

export function useRelatedProducts(brand: string | undefined) {
  return useQuery<Product[]>({
    queryKey: ["relatedProducts", brand],
    queryFn: async () => {
      if (!brand) return [];

      const { data, error } = await supabase.rpc("get_related_products", {
        p_brand: brand,
      });
      if (error) throw error;
      return data;
    },
    enabled: !!brand,
    staleTime: 60 * 60 * 1000,
  });
}
