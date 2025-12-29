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
import { Equipamento } from '../../models/equipamento';
import { EquipamentoService } from '../../services/equipamento.service';
import { AlertService } from '../../services/alert.service';
import { EquipamentoFormComponent } from '../../components/equipamento-form/equipamento-form.component';

@Component({
  selector: 'app-equipamentos',
  templateUrl: 'equipamentos.page.html',
  styleUrls: ['equipamentos.page.scss'],
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
    EquipamentoFormComponent,
    IonSpinner,
  ],
})
export class EquipamentosPage implements OnInit {
  private equipamentoService = inject(EquipamentoService);
  private alertService = inject(AlertService);

  equipamentos: Equipamento[] = [];
  carregando = false;
  mostrarFormulario = false;
  equipamentoEditando?: Equipamento;

  constructor() {
    addIcons({ add, create, trash, eye });
  }

  ngOnInit() {
    this.carregarEquipamentos();
  }

  async carregarEquipamentos() {
    this.carregando = true;
    try {
      this.equipamentoService.obterEquipamentos().subscribe({
        next: (equipamentos) => {
          this.equipamentos = equipamentos;
          this.carregando = false;
        },
        error: async (error) => {
          await this.alertService.showError('Erro ao carregar equipamentos');
          this.carregando = false;
        },
      });
    } catch (error) {
      await this.alertService.showError('Erro ao carregar equipamentos');
      this.carregando = false;
    }
  }

  novoEquipamento() {
    this.equipamentoEditando = undefined;
    this.mostrarFormulario = true;
  }

  editarEquipamento(equipamento: Equipamento) {
    this.equipamentoEditando = equipamento;
    this.mostrarFormulario = true;
  }

  async excluirEquipamento(equipamento: Equipamento) {
    const confirmado = await this.alertService.showConfirm(
      'Confirmar Exclusão',
      `Deseja realmente excluir o equipamento ${equipamento.nome}?`
    );

    if (confirmado && equipamento.id) {
      try {
        await this.equipamentoService.excluirEquipamento(equipamento.id);
        await this.alertService.showSuccess(
          'Equipamento excluído com sucesso!'
        );
        this.carregarEquipamentos();
      } catch (error: any) {
        await this.alertService.showError(
          'Erro ao excluir equipamento: ' + error.message
        );
      }
    }
  }

  onEquipamentoSalvo() {
    this.mostrarFormulario = false;
    this.equipamentoEditando = undefined;
    this.carregarEquipamentos();
  }

  onEquipamentoCancelado() {
    this.mostrarFormulario = false;
    this.equipamentoEditando = undefined;
  }
}
