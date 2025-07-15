
import { supabase } from '@/integrations/supabase/client';

interface DummyProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
  stock: number;
}

export const seedProductsFromDummyAPI = async () => {
  try {
    console.log('Fetching products from DummyJSON API...');
    
    // Fetch products from DummyJSON
    const response = await fetch('https://dummyjson.com/products');
    const data = await response.json();
    
    if (!data.products || !Array.isArray(data.products)) {
      throw new Error('Invalid response from DummyJSON API');
    }

    console.log(`Fetched ${data.products.length} products from API`);

    // Get a seller user ID (we'll use the first seller or create a dummy seller ID)
    const { data: sellers, error: sellersError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'seller')
      .limit(1);

    if (sellersError) {
      console.error('Error fetching sellers:', sellersError);
      return;
    }

    // Use a dummy seller ID if no sellers exist yet
    const sellerId = sellers && sellers.length > 0 
      ? sellers[0].user_id 
      : '00000000-0000-0000-0000-000000000000'; // Dummy UUID

    // Transform and insert products
    const productsToInsert = data.products.map((product: DummyProduct) => ({
      name: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      image_url: product.thumbnail,
      stock_quantity: product.stock,
      seller_id: sellerId,
      is_active: true
    }));

    console.log('Inserting products into database...');

    // Insert products in batches to avoid hitting limits
    const batchSize = 10;
    for (let i = 0; i < productsToInsert.length; i += batchSize) {
      const batch = productsToInsert.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('products')
        .insert(batch);

      if (error) {
        console.error('Error inserting product batch:', error);
      } else {
        console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}`);
      }
    }

    console.log('Successfully seeded products from DummyJSON API');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};
