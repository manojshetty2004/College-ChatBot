import { supabase } from '@/integrations/supabase/client';
import { ApiResponse, createApiResponse, handleApiError } from './api';

/**
 * File Upload and Management Service
 */

export interface FileUpload {
  file: File;
  bucket: string;
  path?: string;
}

export interface UploadedFile {
  path: string;
  url: string;
}

const ALLOWED_FILE_TYPES = {
  documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  spreadsheets: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const fileService = {
  /**
   * Validate file before upload
   */
  validateFile(file: File, allowedTypes?: string[]): { valid: boolean; error?: string } {
    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, error: 'File size exceeds 10MB limit' };
    }

    if (allowedTypes && !allowedTypes.includes(file.type)) {
      return { valid: false, error: 'File type not allowed' };
    }

    return { valid: true };
  },

  /**
   * Upload file to Supabase Storage
   */
  async uploadFile({ file, bucket, path }: FileUpload): Promise<ApiResponse<UploadedFile>> {
    try {
      const validation = this.validateFile(file);
      if (!validation.valid) {
        return createApiResponse(undefined, { message: validation.error!, code: 'VALIDATION_ERROR' });
      }

      const fileName = path || `${Date.now()}-${file.name}`;
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return createApiResponse({
        path: data.path,
        url: urlData.publicUrl
      });
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Delete file from storage
   */
  async deleteFile(bucket: string, path: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;
      return createApiResponse();
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Get file URL
   */
  getFileUrl(bucket: string, path: string): string {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  },

  /**
   * List files in a bucket
   */
  async listFiles(bucket: string, folder?: string): Promise<ApiResponse<any[]>> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) throw error;
      return createApiResponse(data);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  }
};
