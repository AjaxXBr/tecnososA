import { Injectable, inject } from '@angular/core';
import { BaseCrudService } from './base-crud.service';
import { Usuario, UsuarioForm } from '../models/usuario';
import { Observable, map, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private colecao = 'usuarios';
  private baseCrud = inject(BaseCrudService);

  constructor() {}

  adicionarUsuario(usuario: UsuarioForm): Promise<string> {
    return this.baseCrud.adicionar(this.colecao, usuario);
  }

  obterUsuarios(): Observable<Usuario[]> {
    return this.baseCrud.obterTodos(this.colecao);
  }

  async obterUsuarioPorId(id: string): Promise<Usuario> {
    return firstValueFrom(this.baseCrud.obterPorId<Usuario>(this.colecao, id));
  }
  async atualizarUsuario(id: string, usuario: UsuarioForm): Promise<void> {
    return this.baseCrud.atualizar(this.colecao, id, usuario);
  }

  excluirUsuario(id: string): Promise<void> {
    return this.baseCrud.excluir(this.colecao, id);
  }

  validarEmailUnico(email: string, idExcluir?: string): Observable<boolean> {
    return this.baseCrud.obterComFiltro(this.colecao, 'email', email).pipe(
      map((usuarios: any[]) => {
        if (idExcluir) {
          return usuarios.filter((u) => u.id !== idExcluir).length === 0;
        }
        return usuarios.length === 0;
      })
    );
  }
}
