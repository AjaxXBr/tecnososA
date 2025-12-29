import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  inject,
} from '@angular/core';
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
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTextarea,
} from '@ionic/angular/standalone';
import { Equipamento, EquipamentoForm } from '../../models/equipamento';
import { Cliente } from '../../models/cliente';
import { EquipamentoService } from '../../services/equipamento.service';
import { ClienteService } from '../../services/cliente.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-equipamento-form',
  templateUrl: './equipamento-form.component.html',
  styleUrls: ['./equipamento-form.component.scss'],
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
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonTextarea,
  ],
})
export class EquipamentoFormComponent implements OnInit {
  @Input() equipamento?: Equipamento;
  @Output() salvo = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

  private equipamentoService = inject(EquipamentoService);
  private clienteService = inject(ClienteService);
  private alertService = inject(AlertService);

  form: EquipamentoForm = {
    nome: '',
    marca: '',
    modelo: '',
    numeroSerie: '',
    clienteId: '',
    especificacoes: '',
    dataAquisicao: new Date().toISOString().substring(0, 10),
  };

  clientes: Cliente[] = [];
  carregando = false;
  editando = false;

  async ngOnInit() {
    this.carregarClientes();
    if (this.equipamento) {
      this.editando = true;
      this.form = {
        nome: this.equipamento.nome,
        marca: this.equipamento.marca,
        modelo: this.equipamento.modelo,
        numeroSerie: this.equipamento.numeroSerie,
        clienteId: this.equipamento.clienteId,
        especificacoes: this.equipamento.especificacoes,
        dataAquisicao: this.equipamento.dataAquisicao
          .toISOString()
          .substring(0, 10),
      };
    }
  }

  async carregarClientes() {
    try {
      this.clienteService.obterClientes().subscribe((clientes) => {
        this.clientes = clientes;
      });
    } catch (error) {
      await this.alertService.showError('Erro ao carregar clientes');
    }
  }

  async salvar() {
    console.log('🔄 Tentando salvar equipamento...', this.form);

    if (this.validarFormulario()) {
      this.carregando = true;
      console.log('✅ Formulário válido, salvando...');

      try {
        if (this.editando && this.equipamento?.id) {
          console.log(
            '✏️ Editando equipamento existente:',
            this.equipamento.id
          );
          await this.equipamentoService.atualizarEquipamento(
            this.equipamento.id,
            this.form
          );
          await this.alertService.showSuccess(
            'Equipamento atualizado com sucesso!'
          );
        } else {
          console.log('➕ Adicionando novo equipamento');
          await this.equipamentoService.adicionarEquipamento(this.form);
          await this.alertService.showSuccess(
            'Equipamento cadastrado com sucesso!'
          );
        }

        console.log('✅ Equipamento salvo com sucesso');
        this.salvo.emit();
        this.limparFormulario();
      } catch (error: any) {
        console.error('❌ Erro ao salvar equipamento:', error);
        await this.alertService.showError(
          'Erro ao salvar equipamento: ' + error.message
        );
      } finally {
        this.carregando = false;
        console.log('🏁 Processo de salvamento finalizado');
      }
    } else {
      console.log('❌ Formulário inválido');
    }
  }

  cancelar() {
    this.cancelado.emit();
    this.limparFormulario();
  }

  private validarFormulario(): boolean {
    if (!this.form.nome || this.form.nome.trim().length < 2) {
      this.alertService.showError('Nome deve ter pelo menos 2 caracteres');
      return false;
    }

    if (!this.form.marca) {
      this.alertService.showError('Marca é obrigatória');
      return false;
    }

    if (!this.form.modelo) {
      this.alertService.showError('Modelo é obrigatório');
      return false;
    }

    if (!this.form.numeroSerie) {
      this.alertService.showError('Número de série é obrigatório');
      return false;
    }

    if (!this.form.clienteId) {
      this.alertService.showError('Cliente é obrigatório');
      return false;
    }

    return true;
  }

  private limparFormulario() {
    this.form = {
      nome: '',
      marca: '',
      modelo: '',
      numeroSerie: '',
      clienteId: '',
      especificacoes: '',
      dataAquisicao: new Date().toISOString().substring(0, 10),
    };
    this.editando = false;
  }
}
