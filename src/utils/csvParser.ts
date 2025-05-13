import Papa from 'papaparse';
import { Contact } from '../types';

interface CSVRow {
  "Nª": string;
  "Situação": string;
  "Nome Completo": string;
  "Qual seu Bairro": string;
  "Número de telefone": string;
  "Número Limpo": string;
  "E-mail": string;
  "Idade": string;
  "Você deseja participar em qual turno": string;
  [key: string]: string; // Allow for other columns
}

export const parseCSV = (file: File): Promise<Contact[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error('Erro ao processar o arquivo CSV: ' + results.errors[0].message));
          return;
        }

        // Transform the data to match our Contact interface
        const contacts: Contact[] = results.data.map((row) => ({
          número: row["Nª"] || '',
          situação: row["Situação"] || '',
          nome_completo: row["Nome Completo"] || '',
          qual_seu_bairro: row["Qual seu Bairro"] || '',
          número_de_telefone: row["Número de telefone"] || '',
          número_limpo: row["Número Limpo"] || '',
          email: row["E-mail"] || '',
          idade: row["Idade"] || '',
          você_deseja_participar_em_qual_turno: row["Você deseja participar em qual turno"] || '',
          selected: false
        }));

        resolve(contacts);
      },
      error: (error) => {
        reject(new Error('Erro ao processar o arquivo CSV: ' + error.message));
      }
    });
  });
};

export const getUniqueTurnOptions = (contacts: Contact[]): string[] => {
  const turnSet = new Set<string>();
  
  contacts.forEach(contact => {
    if (contact.você_deseja_participar_em_qual_turno) {
      turnSet.add(contact.você_deseja_participar_em_qual_turno);
    }
  });
  
  return Array.from(turnSet);
};