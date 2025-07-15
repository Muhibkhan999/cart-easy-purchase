
import { supabase } from "@/integrations/supabase/client";

export const createUserProfile = async (
  userId: string,
  email: string,
  fullName: string,
  userType: string
) => {
  try {
    // Insert profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: userId,
        email,
        full_name: fullName
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      throw profileError;
    }

    // Insert user role
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: userType
      });

    if (roleError) {
      console.error('Role creation error:', roleError);
      throw roleError;
    }

    // If seller, create seller profile
    if (userType === 'seller') {
      const { error: sellerError } = await supabase
        .from('seller_profiles')
        .insert({
          user_id: userId,
          business_name: `${fullName}'s Store`,
          is_verified: false
        });

      if (sellerError) {
        console.error('Seller profile creation error:', sellerError);
        throw sellerError;
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Profile creation failed:', error);
    return { success: false, error };
  }
};
