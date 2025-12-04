import { supabase } from '@/integrations/supabase/client';
import { ApiResponse, createApiResponse, handleApiError } from './api';

export interface Note {
  id: string;
  title: string;
  description: string | null;
  file_path: string;
  file_url: string;
  category: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateNoteData {
  title: string;
  description?: string;
  file_path: string;
  file_url: string;
  category: string;
}

export const notesService = {
  async getNotes(): Promise<ApiResponse<Note[]>> {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return createApiResponse(data as Note[]);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  async getNotesByCategory(category: string): Promise<ApiResponse<Note[]>> {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return createApiResponse(data as Note[]);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  async createNote(noteData: CreateNoteData): Promise<ApiResponse<Note>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('notes')
        .insert({
          ...noteData,
          created_by: user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return createApiResponse(data as Note);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  async updateNote(id: string, noteData: Partial<CreateNoteData>): Promise<ApiResponse<Note>> {
    try {
      const { data, error } = await supabase
        .from('notes')
        .update(noteData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return createApiResponse(data as Note);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  async deleteNote(id: string, filePath: string): Promise<ApiResponse<void>> {
    try {
      // Delete file from storage
      await supabase.storage.from('notes').remove([filePath]);
      
      // Delete record from database
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return createApiResponse();
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  async uploadPDF(file: File): Promise<ApiResponse<{ path: string; url: string }>> {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      
      const { data, error } = await supabase.storage
        .from('notes')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('notes')
        .getPublicUrl(data.path);

      return createApiResponse({
        path: data.path,
        url: urlData.publicUrl
      });
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  }
};
