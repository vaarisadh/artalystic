import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_PROJECT_URL)) ||
  (typeof process !== 'undefined' && process.env && (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || process.env.SUPABASE_PROJECT_URL)) ||
  'https://ureojzakafyviipjflwj.supabase.co';

const SUPABASE_ANON_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)) ||
  (typeof process !== 'undefined' && process.env && (process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY)) ||
  '';

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Uploads an artwork file to Supabase Storage ('artworks' bucket) and returns the public URL.
 * Uses the active authenticated session on the shared Supabase client.
 */
export async function uploadArtworkToSupabase(
  file: File,
  folder: string = 'artworks'
): Promise<{ url: string; fileType: string; error: string | null }> {
  try {
    if (!SUPABASE_ANON_KEY) {
      return {
        url: '',
        fileType: '',
        error: 'Supabase Anon / Publishable Key is missing from environment variables. Please configure VITE_SUPABASE_ANON_KEY.',
      };
    }

    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const filePath = `${folder}/${timestamp}_${sanitizedName}`;

    // Upload artwork to 'artworks' bucket in Supabase
    const { data, error } = await supabase.storage
      .from('artworks')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || undefined,
      });

    if (error) {
      console.error('Supabase Storage upload error:', error);
      return { url: '', fileType: '', error: error.message || 'Supabase upload failed.' };
    }

    // Retrieve public URL from 'artworks' bucket
    const { data: publicUrlData } = supabase.storage
      .from('artworks')
      .getPublicUrl(data.path);

    return {
      url: publicUrlData.publicUrl,
      fileType: file.type || 'image/png',
      error: null,
    };
  } catch (err: any) {
    console.error('Supabase Storage Exception:', err);
    return { url: '', fileType: '', error: err.message || 'Supabase Storage upload failed.' };
  }
}

