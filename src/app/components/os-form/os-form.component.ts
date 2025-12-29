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
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTextarea,
} from '@ionic/angular/standalone';
import {
  OrdemServico,
  OrdemServicoForm,
  StatusOS,
  PrioridadeOS,
} from '../../models/os';
import { Equipamento } from '../../models/equipamento';
import { OsService } from '../../services/os.service';
import { EquipamentoService } from '../../services/equipamento.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-os-form',
  templateUrl: './os-form.component.html',
  styleUrls: ['./os-form.component.scss'],
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
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonTextarea,
  ],
})
export class OsFormComponent implements OnInit {
  @Input() os?: OrdemServico;
  @Output() salvo = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

  private osService = inject(OsService);
  private equipamentoService = inject(EquipamentoService);
  private alertService = inject(AlertService);

  form: OrdemServicoForm = {
    equipamentoId: '',
    defeitoRelatado: '',
    observacoesTecnicas: '',
    status: 'aguardando',
    prioridade: 'media',
  };

  equipamentos: Equipamento[] = [];
  carregando = false;
  editando = false;

  statusOptions: { value: StatusOS; label: string }[] = [
    { value: 'aguardando', label: 'Aguardando' },
    { value: 'em_reparo', label: 'Em Reparo' },
    { value: 'pronto', label: 'Pronto' },
    { value: 'cancelado', label: 'Cancelado' },
  ];

  prioridadeOptions: { value: PrioridadeOS; label: string }[] = [
    { value: 'baixa', label: 'Baixa' },
    { value: 'media', label: 'Média' },
    { value: 'alta', label: 'Alta' },
  ];

  async ngOnInit() {
    this.carregarEquipamentos();
    if (this.os) {
      this.editando = true;
      this.form = {
        equipamentoId: this.os.equipamentoId,
        defeitoRelatado: this.os.defeitoRelatado,
        observacoesTecnicas: this.os.observacoesTecnicas,
        status: this.os.status,
        prioridade: this.os.prioridade,
      };
    }
  }

  async carregarEquipamentos() {
    try {
      this.equipamentoService.obterEquipamentos().subscribe((equipamentos) => {
        this.equipamentos = equipamentos;
      });
    } catch (error) {
      await this.alertService.showError('Erro ao carregar equipamentos');
    }
  }

  async salvar() {
    console.log('🔄 Tentando salvar OS...', this.form);

    if (this.validarFormulario()) {
      this.carregando = true;
      console.log('✅ Formulário OS válido, salvando...');

      try {
        if (this.editando && this.os?.id) {
          console.log('✏️ Editando OS existente:', this.os.id);
          await this.osService.atualizarOS(this.os.id, this.form);
          await this.alertService.showSuccess('OS atualizada com sucesso!');
        } else {
          console.log('➕ Adicionando nova OS');
          await this.osService.adicionarOS(this.form);
          await this.alertService.showSuccess('OS cadastrada com sucesso!');
        }

        console.log('✅ OS salva com sucesso');
        this.salvo.emit();
        this.limparFormulario();
      } catch (error: any) {
        console.error('❌ Erro ao salvar OS:', error);
        await this.alertService.showError(
          'Erro ao salvar OS: ' + error.message
        );
      } finally {
        this.carregando = false;
        console.log('🏁 Processo de salvamento OS finalizado');
      }
    } else {
      console.log('❌ Formulário OS inválido');
    }
  }

  cancelar() {
    this.cancelado.emit();
    this.limparFormulario();
  }

  private validarFormulario(): boolean {
    if (!this.form.equipamentoId) {
      this.alertService.showError('Equipamento é obrigatório');
      return false;
    }

    if (
      !this.form.defeitoRelatado ||
      this.form.defeitoRelatado.trim().length < 5
    ) {
      this.alertService.showError(
        'Defeito relatado deve ter pelo menos 5 caracteres'
      );
      return false;
    }

    return true;
  }

  private limparFormulario() {
    this.form = {
      equipamentoId: '',
      defeitoRelatado: '',
      observacoesTecnicas: '',
      status: 'aguardando',
      prioridade: 'media',
    };
    this.editando = false;
  }
}
