import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useAuth() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    },
    staleTime: 60 * 60 * 1000,
  });
}
