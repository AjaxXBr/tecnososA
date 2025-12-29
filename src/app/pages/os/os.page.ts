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
  IonSegment,
  IonSegmentButton,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, create, trash, eye, checkmark, close } from 'ionicons/icons';
import { OrdemServico, StatusOS } from '../../models/os';
import { OsService } from '../../services/os.service';
import { AlertService } from '../../services/alert.service';
import { OsFormComponent } from '../../components/os-form/os-form.component';

@Component({
  selector: 'app-os',
  templateUrl: 'os.page.html',
  styleUrls: ['os.page.scss'],
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
    IonSegment,
    IonSegmentButton,
    OsFormComponent,
    IonSpinner,
  ],
})
export class OSPage implements OnInit {
  private osService = inject(OsService);
  private alertService = inject(AlertService);

  ordensServico: OrdemServico[] = [];
  ordensFiltradas: OrdemServico[] = [];
  carregando = false;
  mostrarFormulario = false;
  osEditando?: OrdemServico;
  segmentoAtivo: StatusOS = 'aguardando';

  constructor() {
    addIcons({ add, create, trash, eye, checkmark, close });
  }

  ngOnInit() {
    this.carregarOS();
  }

  async carregarOS() {
    this.carregando = true;
    try {
      this.osService.obterOS().subscribe({
        next: (os) => {
          this.ordensServico = os;
          this.filtrarOS();
          this.carregando = false;
        },
        error: async (error) => {
          await this.alertService.showError(
            'Erro ao carregar ordens de serviço'
          );
          this.carregando = false;
        },
      });
    } catch (error) {
      await this.alertService.showError('Erro ao carregar ordens de serviço');
      this.carregando = false;
    }
  }

  filtrarOS() {
    this.ordensFiltradas = this.ordensServico.filter(
      (os) => os.status === this.segmentoAtivo
    );
  }

  mudarSegmento(event: any) {
    this.segmentoAtivo = event.detail.value;
    this.filtrarOS();
  }

  novaOS() {
    this.osEditando = undefined;
    this.mostrarFormulario = true;
  }

  editarOS(os: OrdemServico) {
    this.osEditando = os;
    this.mostrarFormulario = true;
  }

  async excluirOS(os: OrdemServico) {
    const confirmado = await this.alertService.showConfirm(
      'Confirmar Exclusão',
      `Deseja realmente excluir a OS ${os.numero}?`
    );

    if (confirmado && os.id) {
      try {
        await this.osService.excluirOS(os.id);
        await this.alertService.showSuccess('OS excluída com sucesso!');
        this.carregarOS();
      } catch (error: any) {
        await this.alertService.showError(
          'Erro ao excluir OS: ' + error.message
        );
      }
    }
  }

  async atualizarStatusOS(os: OrdemServico, novoStatus: StatusOS) {
    if (os.id) {
      try {
        await this.osService.atualizarStatusOS(os.id, novoStatus);
        await this.alertService.showSuccess('Status atualizado com sucesso!');
        this.carregarOS();
      } catch (error: any) {
        await this.alertService.showError(
          'Erro ao atualizar status: ' + error.message
        );
      }
    }
  }

  getIconeStatus(status: StatusOS): string {
    const icones = {
      aguardando: 'time',
      em_reparo: 'construct',
      pronto: 'checkmark-circle',
      cancelado: 'close-circle',
    };
    return icones[status];
  }

  getCorStatus(status: StatusOS): string {
    const cores = {
      aguardando: 'warning',
      em_reparo: 'primary',
      pronto: 'success',
      cancelado: 'danger',
    };
    return cores[status];
  }

  avancarStatus(os: OrdemServico) {
    const proximosStatus: { [key in StatusOS]: StatusOS } = {
      aguardando: 'em_reparo',
      em_reparo: 'pronto',
      pronto: 'pronto',
      cancelado: 'cancelado',
    };

    const novoStatus = proximosStatus[os.status];
    this.atualizarStatusOS(os, novoStatus);
  }

  getTextoStatus(): string {
    const textos = {
      aguardando: 'em espera',
      em_reparo: 'em reparo',
      pronto: 'prontas',
      cancelado: 'canceladas',
    };
    return textos[this.segmentoAtivo];
  }

  onOSSalva() {
    this.mostrarFormulario = false;
    this.osEditando = undefined;
    this.carregarOS();
  }

  onOSCancelada() {
    this.mostrarFormulario = false;
    this.osEditando = undefined;
  }
}
