import { create } from 'zustand';
import { MessagingState, Contact } from '../types';
import { useContactsStore } from './contactsStore';

const WEBHOOK_URL = 'https://n8n-webhook.pklm7f.easypanel.host/webhook/enviar';

export const useMessagingStore = create<MessagingState>((set, get) => ({
  message: '',
  sending: false,
  success: null,
  error: null,

  setMessage: (message: string) => {
    set({ message });
  },

  sendMessages: async (contacts: Contact[]) => {
    const { message } = get();
    
    if (!message.trim()) {
      set({ error: 'Por favor, digite uma mensagem antes de enviar.' });
      return;
    }
    
    if (contacts.length === 0) {
      set({ error: 'Por favor, selecione pelo menos um contato.' });
      return;
    }
    
    set({ sending: true, error: null, success: null });
    
    try {
      // Prevent duplicates by using a Set to track phone numbers
      const uniqueContacts = Array.from(
        new Map(contacts.map(contact => [contact.número_limpo, contact])).values()
      );
      
      // Prepare data for webhook
      const payload = {
        message,
        contacts: uniqueContacts.map(contact => ({
          name: contact.nome_completo,
          phone: contact.número_limpo,
          turnout: contact.você_deseja_participar_em_qual_turno,
          email: contact.email,
          age: contact.idade
        }))
      };
      
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao enviar mensagens: ${response.statusText}`);
      }
      
      // Mark contacts as sent
      useContactsStore.getState().markContactsAsSent(
        uniqueContacts.map(contact => contact.número_limpo)
      );
      
      set({ 
        sending: false,
        success: true 
      });
    } catch (error: any) {
      set({ 
        sending: false,
        error: error.message,
        success: false
      });
    }
  },

  resetStatus: () => {
    set({ 
      success: null,
      error: null 
    });
  }
}));