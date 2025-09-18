import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useCurrencyRate() {
  return useQuery({
    queryKey: ["currencyRate"],
    queryFn: async () => {
      const { data } = await supabase
        .from("currency_rate")
        .select("*")
        .limit(1);
      return data;
    },
    staleTime: 60 * 60 * 1000,
  });
}
