export interface Cliente {
  id?: string;
  nome: string;
  telefone: string;
  email: string;
  endereco: string;
  dataCadastro: Date;
  dataAtualizacao?: Date;
  ativo: boolean;
}

export interface ClienteForm {
  nome: string;
  telefone: string;
  email: string;
  endereco: string;
}

export type ClienteValidacao = {
  emailUnico: boolean;
  telefoneUnico: boolean;
};