
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { seedProductsFromDummyAPI } from '@/utils/seedProducts';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  stock_quantity: number;
  seller_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('Fetching products from database...');
      
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }

      // If no products exist, seed them from the API
      if (!products || products.length === 0) {
        console.log('No products found, seeding from DummyJSON API...');
        await seedProductsFromDummyAPI();
        
        // Fetch again after seeding
        const { data: seededProducts, error: seededError } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (seededError) {
          console.error('Error fetching seeded products:', seededError);
          throw seededError;
        }

        return seededProducts || [];
      }

      return products;
    },
  });
};
