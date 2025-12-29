import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonAvatar,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, create, trash, eye } from 'ionicons/icons';
import { Cliente } from '../../models/cliente';
import { ClienteService } from '../../services/cliente.service';
import { AlertService } from '../../services/alert.service';
import { ClienteFormComponent } from '../../components/cliente-form/cliente-form.component';
import { ClienteDetalhesComponent } from '../../components/cliente-detalhes/cliente-detalhes.component';

@Component({
  selector: 'app-clientes',
  templateUrl: 'clientes.page.html',
  styleUrls: ['clientes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonAvatar,
    ClienteFormComponent,
    ClienteDetalhesComponent,
    IonSpinner,
  ],
})
export class ClientesPage implements OnInit {
  private clienteService = inject(ClienteService);
  private alertService = inject(AlertService);

  clientes: Cliente[] = [];
  carregando = false;
  mostrarFormulario = false;
  mostrarDetalhes = false;
  clienteSelecionado?: Cliente;
  clienteEditando?: Cliente;

  constructor() {
    addIcons({ add, create, trash, eye });
  }

  ngOnInit() {
    this.carregarClientes();
  }

  async carregarClientes() {
    this.carregando = true;
    try {
      this.clienteService.obterClientes().subscribe({
        next: (clientes) => {
          console.log('✅ Clientes carregados:', clientes);
          this.clientes = clientes;
          this.carregando = false;
        },
        error: async (error) => {
          console.error('❌ Erro ao carregar clientes:', error);
          await this.alertService.showError(
            'Erro ao carregar clientes: ' + error.message
          );
          this.carregando = false;
        },
      });
    } catch (error: any) {
      console.error('❌ Erro no carregarClientes:', error);
      await this.alertService.showError(
        'Erro ao carregar clientes: ' + error.message
      );
      this.carregando = false;
    }
  }

  novoCliente() {
    this.clienteEditando = undefined;
    this.mostrarFormulario = true;
    this.mostrarDetalhes = false;
  }

  editarCliente(cliente: Cliente) {
    this.clienteEditando = cliente;
    this.mostrarFormulario = true;
    this.mostrarDetalhes = false;
  }

  visualizarCliente(cliente: Cliente) {
    this.clienteSelecionado = cliente;
    this.mostrarDetalhes = true;
    this.mostrarFormulario = false;
  }

  async excluirCliente(cliente: Cliente) {
    const confirmado = await this.alertService.showConfirm(
      'Confirmar Exclusão',
      `Deseja realmente excluir o cliente ${cliente.nome}?`
    );

    if (confirmado && cliente.id) {
      try {
        await this.clienteService.excluirCliente(cliente.id);
        await this.alertService.showSuccess('Cliente excluído com sucesso!');
        this.carregarClientes();
      } catch (error: any) {
        await this.alertService.showError(
          'Erro ao excluir cliente: ' + error.message
        );
      }
    }
  }

  onClienteSalvo() {
    this.mostrarFormulario = false;
    this.clienteEditando = undefined;
    this.carregarClientes();
  }

  onClienteCancelado() {
    this.mostrarFormulario = false;
    this.clienteEditando = undefined;
  }

  onVoltarDetalhes() {
    this.mostrarDetalhes = false;
    this.clienteSelecionado = undefined;
  }

  onEditarDetalhes(cliente: Cliente) {
    this.mostrarDetalhes = false;
    this.editarCliente(cliente);
  }
}
