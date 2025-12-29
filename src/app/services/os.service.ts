import { Injectable, inject } from '@angular/core';
import { BaseCrudService } from './base-crud.service';
import { OrdemServico, OrdemServicoForm, StatusOS } from '../models/os';
import { Observable, map, firstValueFrom } from 'rxjs';
import { EquipamentoService } from './equipamento.service';
import { ClienteService } from './cliente.service';

@Injectable({
  providedIn: 'root',
})
export class OsService {
  private colecao = 'ordens-servico';
  private baseCrud = inject(BaseCrudService);
  private equipamentoService = inject(EquipamentoService);
  private clienteService = inject(ClienteService);

  constructor() {}

  async adicionarOS(os: OrdemServicoForm): Promise<string> {
    console.log('🔄 Iniciando cadastro de OS...', os);

    const numeroOS = await this.gerarNumeroOS();

    const equipamento = await firstValueFrom(
      this.equipamentoService.obterEquipamentoPorId(os.equipamentoId)
    );

    if (!equipamento) {
      throw new Error('Equipamento não encontrado');
    }

    const osCompleta = {
      ...os,
      numero: numeroOS,
      equipamentoNome: equipamento.nome,
      clienteId: equipamento.clienteId,
      clienteNome: equipamento.clienteNome,
      dataAbertura: new Date(),
      valorTotal: 0,
    };

    console.log('✅ OS completa para salvar:', osCompleta);
    return this.baseCrud.adicionar(this.colecao, osCompleta);
  }

  obterOS(): Observable<OrdemServico[]> {
    return this.baseCrud.obterTodos(this.colecao);
  }

  obterOSPorStatus(status: StatusOS): Observable<OrdemServico[]> {
    return this.baseCrud.obterComFiltro(this.colecao, 'status', status);
  }

  obterOSPorId(id: string): Observable<OrdemServico> {
    return this.baseCrud.obterPorId(this.colecao, id);
  }

  obterOSPorCliente(clienteId: string): Observable<OrdemServico[]> {
    return this.baseCrud.obterComFiltro(this.colecao, 'clienteId', clienteId);
  }

  atualizarOS(id: string, os: Partial<OrdemServicoForm>): Promise<void> {
    return this.baseCrud.atualizar(this.colecao, id, os);
  }

  async atualizarStatusOS(id: string, status: StatusOS): Promise<void> {
    const dadosAtualizacao: any = { status };

    if (status === 'pronto') {
      dadosAtualizacao.dataConclusao = new Date();
    }

    return this.baseCrud.atualizar(this.colecao, id, dadosAtualizacao);
  }

  excluirOS(id: string): Promise<void> {
    return this.baseCrud.excluir(this.colecao, id);
  }

  private async gerarNumeroOS(): Promise<string> {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');

    const osDoMes = await firstValueFrom(this.obterOSDoMes(ano, mes));
    const sequencial = osDoMes ? osDoMes.length + 1 : 1;

    return `OS${ano}${mes}${sequencial.toString().padStart(3, '0')}`;
  }

  private obterOSDoMes(ano: number, mes: string): Observable<OrdemServico[]> {
    return this.obterOS().pipe(
      map((osList) =>
        osList.filter((os) => {
          const dataOS = new Date(os.dataAbertura);
          return (
            dataOS.getFullYear() === ano &&
            (dataOS.getMonth() + 1).toString().padStart(2, '0') === mes
          );
        })
      )
    );
  }
}
