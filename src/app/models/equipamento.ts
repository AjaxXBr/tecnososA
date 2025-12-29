export interface Equipamento {
  id: string;
  nome: string;
  marca: string;
  modelo: string;
  numeroSerie: string;
  clienteId: string;
  clienteNome: string;
  especificacoes: string;
  dataAquisicao: Date | any;
  dataCriacao?: Date | any;
}

export interface EquipamentoForm {
  nome: string;
  marca: string;
  modelo: string;
  numeroSerie: string;
  clienteId: string;
  especificacoes: string;
  dataAquisicao: string;
}

export type EquipamentoValidacao = {
  numeroSerieUnico: boolean;
};