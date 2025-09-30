import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import amplitude from "@/app/amplitude";

export function useAuth() {
  const query = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) throw error ?? new Error("No user");
      return data.user;
    },
    staleTime: 60 * 60 * 1000,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      amplitude.setUserId(query.data.id);
    } else if (query.isError) {
      amplitude.track("Auth Error", { error: String(query.error) });
    }
  }, [query.isSuccess, query.isError, query.data, query.error]);

  return query;
}
