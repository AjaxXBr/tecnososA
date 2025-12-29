import { Injectable, inject } from '@angular/core';
import { BaseCrudService } from './base-crud.service';
import { Cliente, ClienteForm } from '../models/cliente';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private colecao = 'clientes';
  private baseCrud = inject(BaseCrudService);

  obterClientes(): Observable<Cliente[]> {
    console.log('📖 Buscando todos os clientes');
    return this.baseCrud.obterTodos<Cliente>(this.colecao);
  }

  obterClientePorId(id: string): Observable<Cliente> {
    return this.baseCrud.obterPorId<Cliente>(this.colecao, id);
  }

  async adicionarCliente(cliente: ClienteForm): Promise<string> {
    if (!cliente.nome || cliente.nome.trim().length < 3) {
      throw new Error('Nome do cliente deve ter pelo menos 3 caracteres');
    }

    const dadosCliente = {
      ...cliente,
      dataCriacao: new Date(),
    };

    return this.baseCrud.adicionar(this.colecao, dadosCliente);
  }

  async atualizarCliente(id: string, cliente: ClienteForm): Promise<void> {
    if (!cliente.nome || cliente.nome.trim().length < 3) {
      throw new Error('Nome do cliente deve ter pelo menos 3 caracteres');
    }

    const dadosAtualizacao = {
      ...cliente,
      dataAtualizacao: new Date(),
    };

    return this.baseCrud.atualizar(this.colecao, id, dadosAtualizacao);
  }

  async excluirCliente(id: string): Promise<void> {
    return this.baseCrud.excluir(this.colecao, id);
  }

  validarEmailUnico(email: string, idExcluir?: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.obterClientes().subscribe({
        next: (clientes) => {
          const clientesFiltrados = idExcluir
            ? clientes.filter(
                (c: any) => c.id !== idExcluir && c.email === email
              )
            : clientes.filter((c: any) => c.email === email);

          observer.next(clientesFiltrados.length === 0);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        },
      });
    });
  }
}
