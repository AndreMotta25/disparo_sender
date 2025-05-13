import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { AuthState, User } from '../types';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Fetch additional user data from users_juv table
      const { data: userData, error: userError } = await supabase
        .from('users_juv')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (userError) throw userError;

      set({
        user: {
          id: data.user.id,
          email: data.user.email!,
          name: userData.name,
          unit: userData.unit,
          created_at: userData.created_at,
        },
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  register: async (email: string, password: string, name: string, unit: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('Usuário não criado');

      // Insert into users_juv table
      const { error: userError } = await supabase
        .from('users_juv')
        .insert([
          {
            id: data.user.id,
            name,
            email,
            unit,
          },
        ]);

      if (userError) throw userError;

      set({
        user: {
          id: data.user.id,
          email: data.user.email!,
          name,
          unit,
          created_at: new Date().toISOString(),
        },
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));