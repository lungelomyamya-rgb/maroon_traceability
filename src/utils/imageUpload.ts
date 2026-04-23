import { supabase } from '@/features/registration/services/supabaseClient';

/**
 * Upload image to Supabase Storage
 */
export async function uploadImage(file: File, userId: string): Promise<string> {
  try {
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    // Create unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar.${fileExt}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true, // Overwrite existing avatar
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
}

/**
 * Delete image from Supabase Storage
 */
export async function deleteImage(userId: string): Promise<void> {
  try {
    if (!supabase) {
      console.error('Supabase client not available for delete');
      return;
    }

    // List files in user's avatar folder
    const { data: files } = await supabase.storage
      .from('avatars')
      .list(userId);

    if (files && files.length > 0) {
      // Delete all avatar files for this user
      const filesToDelete = files.map((file: any) => `${userId}/${file.name}`);
      
      const { error } = await supabase.storage
        .from('avatars')
        .remove(filesToDelete);

      if (error) {
        console.error('Delete error:', error);
      }
    }
  } catch (error) {
    console.error('Image delete error:', error);
  }
}
