import { create } from 'zustand';
import { Contact, ContactsState } from '../types';

export const useContactsStore = create<ContactsState>((set, get) => ({
  contacts: [],
  filteredContacts: [],
  searchTerm: '',
  selectedFilter: '',
  loading: false,

  setContacts: (contacts: Contact[]) => {
    const contactsWithSelected = contacts.map(contact => ({
      ...contact,
      selected: false,
      messageSent: false
    }));
    
    set({ 
      contacts: contactsWithSelected,
      filteredContacts: contactsWithSelected,
      searchTerm: '',
      selectedFilter: ''
    });
  },

  setSearchTerm: (term: string) => {
    const { contacts, selectedFilter } = get();
    set({ searchTerm: term });
    
    // Apply both search term and filter
    let filtered = [...contacts];
    
    if (term) {
      const searchLower = term.toLowerCase();
      filtered = filtered.filter(contact => 
        contact.nome_completo.toLowerCase().includes(searchLower) ||
        contact.email.toLowerCase().includes(searchLower) ||
        contact.número_de_telefone.includes(searchLower) ||
        contact.qual_seu_bairro.toLowerCase().includes(searchLower) ||
        contact.você_deseja_participar_em_qual_turno.toLowerCase().includes(searchLower)
      );
    }
    
    if (selectedFilter) {
      filtered = filtered.filter(contact => 
        contact.você_deseja_participar_em_qual_turno === selectedFilter
      );
    }
    
    set({ filteredContacts: filtered });
  },

  setSelectedFilter: (filter: string) => {
    const { contacts, searchTerm } = get();
    const newFilter = filter === get().selectedFilter ? '' : filter;
    set({ selectedFilter: newFilter });
    
    // Apply both search term and filter
    let filtered = [...contacts];
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(contact => 
        contact.nome_completo.toLowerCase().includes(searchLower) ||
        contact.email.toLowerCase().includes(searchLower) ||
        contact.número_de_telefone.includes(searchLower) ||
        contact.qual_seu_bairro.toLowerCase().includes(searchLower) ||
        contact.você_deseja_participar_em_qual_turno.toLowerCase().includes(searchLower)
      );
    }
    
    if (newFilter) {
      filtered = filtered.filter(contact => 
        contact.você_deseja_participar_em_qual_turno === newFilter
      );
    }
    
    set({ filteredContacts: filtered });
  },

  showAllContacts: () => {
    const { contacts, searchTerm } = get();
    set({ 
      selectedFilter: '',
      filteredContacts: searchTerm ? contacts.filter(contact => {
        const searchLower = searchTerm.toLowerCase();
        return contact.nome_completo.toLowerCase().includes(searchLower) ||
               contact.email.toLowerCase().includes(searchLower) ||
               contact.número_de_telefone.includes(searchLower) ||
               contact.qual_seu_bairro.toLowerCase().includes(searchLower) ||
               contact.você_deseja_participar_em_qual_turno.toLowerCase().includes(searchLower);
      }) : contacts
    });
  },

  toggleSelectAll: (selected: boolean) => {
    const { filteredContacts, contacts } = get();
    
    // Create a map of all filtered contact numbers for fast lookup
    const filteredNumbersMap = new Set(filteredContacts.map(c => c.número_limpo));
    
    // Update selection state for all contacts
    const updatedContacts = contacts.map(contact => ({
      ...contact,
      selected: filteredNumbersMap.has(contact.número_limpo) ? selected : contact.selected
    }));
    
    // Update filtered contacts with new selection state
    const updatedFilteredContacts = filteredContacts.map(contact => ({
      ...contact,
      selected
    }));
    
    set({ 
      contacts: updatedContacts,
      filteredContacts: updatedFilteredContacts
    });
  },

  toggleContactSelection: (index: number, selected: boolean) => {
    const { filteredContacts, contacts } = get();
    
    // Find the contact in filtered contacts
    const contactToToggle = filteredContacts[index];
    
    // Update the contact in both arrays
    const updatedFilteredContacts = [...filteredContacts];
    updatedFilteredContacts[index] = { ...contactToToggle, selected };
    
    // Find and update the same contact in the full contacts array
    const updatedContacts = contacts.map(contact => 
      contact.número_limpo === contactToToggle.número_limpo
        ? { ...contact, selected }
        : contact
    );
    
    set({ 
      contacts: updatedContacts,
      filteredContacts: updatedFilteredContacts
    });
  },

  clearContacts: () => {
    set({ 
      contacts: [],
      filteredContacts: [],
      searchTerm: '',
      selectedFilter: ''
    });
  },

  getSelectedContacts: () => {
    return get().contacts.filter(contact => contact.selected);
  },

  markContactsAsSent: (contactNumbers: string[]) => {
    const { contacts, filteredContacts } = get();
    
    // Create a Set for O(1) lookup
    const sentNumbersSet = new Set(contactNumbers);
    
    // Update both contacts and filtered contacts
    const updatedContacts = contacts.map(contact => ({
      ...contact,
      messageSent: sentNumbersSet.has(contact.número_limpo) ? true : contact.messageSent
    }));
    
    const updatedFilteredContacts = filteredContacts.map(contact => ({
      ...contact,
      messageSent: sentNumbersSet.has(contact.número_limpo) ? true : contact.messageSent
    }));
    
    set({
      contacts: updatedContacts,
      filteredContacts: updatedFilteredContacts
    });
  }
}));