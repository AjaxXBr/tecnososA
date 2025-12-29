import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSpinner,
} from '@ionic/angular/standalone';
import { Cliente, ClienteForm } from '../../models/cliente';
import { ClienteService } from '../../services/cliente.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonSpinner,
  ],
})
export class ClienteFormComponent {
  @Input() cliente?: Cliente;
  @Output() salvo = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

  private clienteService = inject(ClienteService);
  private alertService = inject(AlertService);

  form: ClienteForm = {
    nome: '',
    telefone: '',
    email: '',
    endereco: '',
  };

  editando = false;
  carregando = false;

  ngOnInit() {
    if (this.cliente) {
      this.editando = true;
      this.form = {
        nome: this.cliente.nome,
        telefone: this.cliente.telefone,
        email: this.cliente.email,
        endereco: this.cliente.endereco,
      };
    }
  }

  async salvar() {
    if (this.validarFormulario()) {
      this.carregando = true;

      try {
        if (this.editando && this.cliente?.id) {
          await this.clienteService.atualizarCliente(
            this.cliente.id,
            this.form
          );
          await this.alertService.showSuccess(
            'Cliente atualizado com sucesso!'
          );
        } else {
          await this.clienteService.adicionarCliente(this.form);
          await this.alertService.showSuccess(
            'Cliente cadastrado com sucesso!'
          );
        }

        this.salvo.emit();
        this.limparFormulario();
      } catch (error: any) {
        await this.alertService.showError(
          'Erro ao salvar cliente: ' + error.message
        );
      } finally {
        this.carregando = false;
      }
    }
  }

  cancelar() {
    this.cancelado.emit();
    this.limparFormulario();
  }

  private validarFormulario(): boolean {
    if (!this.form.nome || this.form.nome.trim().length < 3) {
      this.alertService.showError('Nome deve ter pelo menos 3 caracteres');
      return false;
    }

    if (!this.form.telefone) {
      this.alertService.showError('Telefone é obrigatório');
      return false;
    }

    if (!this.form.email) {
      this.alertService.showError('Email é obrigatório');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.form.email)) {
      this.alertService.showError('Email inválido');
      return false;
    }

    return true;
  }

  private limparFormulario() {
    this.form = {
      nome: '',
      telefone: '',
      email: '',
      endereco: '',
    };
    this.editando = false;
  }
}
