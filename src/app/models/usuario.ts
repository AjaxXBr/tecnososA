export interface Usuario {
  id?: string;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  especialidade: string;
  dataCadastro: Date;
  dataAtualizacao?: Date;
  ativo: boolean;
  uid?: string;
}

export interface UsuarioForm {
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  especialidade: string;
  senha?: string;
  confirmarSenha?: string;
}

export interface LoginData {
  email: string;
  senha: string;
  lembrarMe?: boolean;
}