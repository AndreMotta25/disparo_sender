export interface Contact {
  número: string;
  situação: string;
  nome_completo: string;
  qual_seu_bairro: string;
  número_de_telefone: string;
  número_limpo: string;
  email: string;
  idade: string;
  você_deseja_participar_em_qual_turno: string;
  selected?: boolean;
  messageSent?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  unit: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, unit: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export interface ContactsState {
  contacts: Contact[];
  filteredContacts: Contact[];
  searchTerm: string;
  selectedFilter: string;
  loading: boolean;
  setContacts: (contacts: Contact[]) => void;
  setSearchTerm: (term: string) => void;
  setSelectedFilter: (filter: string) => void;
  showAllContacts: () => void;
  toggleSelectAll: (selected: boolean) => void;
  toggleContactSelection: (index: number, selected: boolean) => void;
  clearContacts: () => void;
  getSelectedContacts: () => Contact[];
  markContactsAsSent: (contactNumbers: string[]) => void;
}

export interface MessagingState {
  message: string;
  sending: boolean;
  success: boolean | null;
  error: string | null;
  setMessage: (message: string) => void;
  sendMessages: (contacts: Contact[]) => Promise<void>;
  resetStatus: () => void;
}