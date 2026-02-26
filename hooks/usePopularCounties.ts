// hooks/useCounties.ts
import { getPopularCountiesLimited } from "@/actions/region.action";
import { useState, useEffect } from "react";
// import { getPopularCountiesLimited } from "@/app/actions";

// Define the County type based on your data structure
interface County {
  id: string | number;
  name: string;
  slug: string;
  // Add other properties that your county object might have
  [key: string]: any; // This allows for additional properties
}

interface UseCountiesReturn {
  counties: County[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePopularCounties(limit: number = 15): UseCountiesReturn {
  const [counties, setCounties] = useState<County[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCounties = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getPopularCountiesLimited(limit);

      if (res.success) {
        setCounties(res.data as County[]);
      } else {
        setError("Failed to load counties");
        setCounties([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading data");
      setCounties([]);
      console.error("Error fetching counties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounties();
  }, [limit]); // Refetch if limit changes

  return {
    counties,
    loading,
    error,
    refetch: fetchCounties, // Expose refetch function if needed
  };
}
