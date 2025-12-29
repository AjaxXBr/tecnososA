import { Component, EventEmitter, Output, inject } from '@angular/core';
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
  IonSpinner,
  ModalController, // ADICIONAR
} from '@ionic/angular/standalone';
import { UsuarioService } from '../../services/usuario.service'; // CRIAR este serviço
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.scss'],
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
    IonSpinner,
  ],
})
export class EditarPerfilComponent {
  @Output() salvo = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

  private usuarioService = inject(UsuarioService);
  private alertService = inject(AlertService);
  private modalCtrl = inject(ModalController); // ADICIONAR

  // Dados atuais do usuário - em uma app real, isso viria de um serviço de autenticação
  form = {
    id: 'usuario-atual-id', // Isso deve vir do serviço de autenticação
    nome: 'Diego Silva',
    email: 'diego@tecnoos.com',
    telefone: '(31) 99999-9999',
    cargo: 'Técnico de Informática',
    especialidade: 'Hardware e Software',
    senha: '',
    confirmarSenha: '',
  };

  carregando = false;

  async salvar() {
    console.log('🔄 Tentando salvar perfil...', this.form);

    if (this.validarFormulario()) {
      this.carregando = true;

      try {
        await this.usuarioService.atualizarUsuario(this.form.id, {
          nome: this.form.nome,
          email: this.form.email,
          telefone: this.form.telefone,
          cargo: this.form.cargo,
          especialidade: this.form.especialidade,
          ...(this.form.senha && { senha: this.form.senha }),
        });

        await this.alertService.showSuccess('Perfil atualizado com sucesso!');

        this.salvo.emit();

        this.modalCtrl.dismiss({ atualizado: true });

        this.limparFormulario();
      } catch (error: any) {
        console.error('❌ Erro ao atualizar perfil:', error);
        await this.alertService.showError(
          'Erro ao atualizar perfil: ' + error.message
        );
      } finally {
        this.carregando = false;
      }
    }
  }

  cancelar() {
    this.cancelado.emit();
    this.modalCtrl.dismiss();
    this.limparFormulario();
  }

  private validarFormulario(): boolean {
    if (!this.form.nome || this.form.nome.trim().length < 3) {
      this.alertService.showError('Nome deve ter pelo menos 3 caracteres');
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

    if (this.form.senha && this.form.senha.length < 6) {
      this.alertService.showError('Senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (this.form.senha !== this.form.confirmarSenha) {
      this.alertService.showError('Senhas não conferem');
      return false;
    }

    return true;
  }

  private limparFormulario() {
    this.form.senha = '';
    this.form.confirmarSenha = '';
  }
}
