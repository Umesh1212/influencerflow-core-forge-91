import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Define the type for a single creator based on your Supabase schema
// This should align with the 'Row' type for the 'creators' table in your types.ts
export type Creator = Database['public']['Tables']['creators']['Row'];

export const useCreators = () => {
  return useQuery<Creator[], Error>({
    queryKey: ['creators'],
    queryFn: async () => {
      console.log('Fetching creators from Supabase...');
      const { data, error } = await supabase
        .from('creators')
        .select(`
          id,
          display_name,
          ig_id,
          yt_id,
          bio,
          location_country,
          primary_language,
          content_example_urls,
          languages,
          stats,
          payout_method,
          created_at,
          user_id,
          embedding 
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching creators:', error);
        throw error;
      }

      console.log('Creators fetched from Supabase:', data);
      return data || []; // Return data or an empty array if data is null
    }
  });
}; 