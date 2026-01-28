import { supabase } from './supabase';

export const storage = {
    /**
     * Upload a file to a specific bucket
     * @param bucket 'avatars' | 'weapons'
     * @param file The file object from input[type=file]
     * @returns The public URL of the uploaded file
     */
    async upload(bucket: 'avatars' | 'weapons', file: File): Promise<string> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return data.publicUrl;
    },

    /**
     * Deletes a file from a bucket by its public URL or path
     */
    async delete(bucket: 'avatars' | 'weapons', url: string) {
        const fileName = url.split('/').pop();
        if (fileName) {
            await supabase.storage.from(bucket).remove([fileName]);
        }
    }
};
