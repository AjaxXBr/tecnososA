export type StatusOS = 'aguardando' | 'em_reparo' | 'pronto' | 'cancelado';
export type PrioridadeOS = 'baixa' | 'media' | 'alta';

export interface OrdemServico {
  id?: string;
  numero: string;
  equipamentoId: string;
  equipamentoNome: string;
  clienteId: string;
  clienteNome: string;
  tecnicoId: string;
  tecnicoNome: string;
  defeitoRelatado: string;
  observacoesTecnicas: string;
  status: StatusOS;
  prioridade: PrioridadeOS;
  valorTotal: number;
  dataAbertura: Date;
  dataConclusao?: Date;
  dataCadastro: Date;
  dataAtualizacao?: Date;
  ativo: boolean;
}

export interface OrdemServicoForm {
  equipamentoId: string;
  defeitoRelatado: string;
  observacoesTecnicas: string;
  status: StatusOS;
  prioridade: PrioridadeOS;
}

export interface FiltroOS {
  status?: StatusOS;
  clienteId?: string;
  tecnicoId?: string;
  dataInicio?: Date;
  dataFim?: Date;
}
