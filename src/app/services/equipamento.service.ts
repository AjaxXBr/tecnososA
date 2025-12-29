import { Injectable, inject } from '@angular/core';
import { BaseCrudService } from './base-crud.service';
import { Equipamento, EquipamentoForm } from '../models/equipamento';
import { Observable, map, firstValueFrom } from 'rxjs';
import { ClienteService } from './cliente.service';

@Injectable({
  providedIn: 'root',
})
export class EquipamentoService {
  private colecao = 'equipamentos';
  private baseCrud = inject(BaseCrudService);
  private clienteService = inject(ClienteService);

  constructor() {}

  async adicionarEquipamento(equipamento: EquipamentoForm): Promise<string> {
    console.log('🔄 Iniciando cadastro de equipamento...', equipamento);

    if (!equipamento.nome || equipamento.nome.trim().length < 2) {
      throw new Error('Nome do equipamento deve ter pelo menos 2 caracteres');
    }

    if (!equipamento.clienteId) {
      throw new Error('Cliente é obrigatório');
    }

    try {
      const cliente = await firstValueFrom(
        this.clienteService.obterClientePorId(equipamento.clienteId)
      );

      if (!cliente) {
        throw new Error('Cliente não encontrado');
      }

      const equipamentoCompleto = {
        ...equipamento,
        clienteNome: cliente.nome,
        dataAquisicao: new Date(equipamento.dataAquisicao),
        dataCriacao: new Date(),
      };

      console.log('✅ Equipamento completo para salvar:', equipamentoCompleto);

      const id = await this.baseCrud.adicionar(
        this.colecao,
        equipamentoCompleto
      );
      console.log('✅ Equipamento salvo com ID:', id);
      return id;
    } catch (error) {
      console.error('❌ Erro ao adicionar equipamento:', error);
      throw error;
    }
  }

  obterEquipamentos(): Observable<Equipamento[]> {
    return this.baseCrud.obterTodos(this.colecao);
  }

  obterEquipamentosPorCliente(clienteId: string): Observable<Equipamento[]> {
    return this.baseCrud.obterComFiltro(this.colecao, 'clienteId', clienteId);
  }

  obterEquipamentoPorId(id: string): Observable<Equipamento> {
    return this.baseCrud.obterPorId(this.colecao, id);
  }

  async atualizarEquipamento(
    id: string,
    equipamento: EquipamentoForm
  ): Promise<void> {
    if (!equipamento.nome || equipamento.nome.trim().length < 2) {
      throw new Error('Nome do equipamento deve ter pelo menos 2 caracteres');
    }

    if (!equipamento.clienteId) {
      throw new Error('Cliente é obrigatório');
    }

    const cliente = await this.clienteService
      .obterClientePorId(equipamento.clienteId)
      .toPromise();

    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }

    const equipamentoCompleto = {
      ...equipamento,
      clienteNome: cliente.nome,
      dataAquisicao: new Date(equipamento.dataAquisicao),
    };

    return this.baseCrud.atualizar(this.colecao, id, equipamentoCompleto);
  }

  excluirEquipamento(id: string): Promise<void> {
    return this.baseCrud.excluir(this.colecao, id);
  }

  validarNumeroSerieUnico(
    numeroSerie: string,
    idExcluir?: string
  ): Observable<boolean> {
    return this.baseCrud
      .obterComFiltro(this.colecao, 'numeroSerie', numeroSerie)
      .pipe(
        map((equipamentos: any[]) => {
          if (idExcluir) {
            return equipamentos.filter((e) => e.id !== idExcluir).length === 0;
          }
          return equipamentos.length === 0;
        })
      );
  }

  buscarEquipamentos(termo: string): Observable<Equipamento[]> {
    return this.obterEquipamentos().pipe(
      map((equipamentos) =>
        equipamentos
          .filter(
            (equipamento) =>
              equipamento.nome.toLowerCase().includes(termo.toLowerCase()) ||
              equipamento.numeroSerie
                .toLowerCase()
                .includes(termo.toLowerCase()) ||
              equipamento.clienteNome
                .toLowerCase()
                .includes(termo.toLowerCase())
          )
          .slice(0, 10)
      )
    );
  }
}
