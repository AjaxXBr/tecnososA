import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  person,
  mail,
  call,
  business,
  statsChart,
  create,
  settings,
  logOut,
} from 'ionicons/icons';
import { AlertService } from '../../services/alert.service';
import { EditarPerfilComponent } from '../../components/editar-perfil/editar-perfil.component';

@Component({
  selector: 'app-conta',
  templateUrl: 'conta.page.html',
  styleUrls: ['conta.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonAvatar,
    EditarPerfilComponent,
  ],
})
export class ContaPage {
  private alertService = inject(AlertService);

  mostrarEditarPerfil = false;
  estatisticas = {
    osMes: 12,
    clientesAtendidos: 8,
    equipamentos: 15,
  };

  constructor() {
    addIcons({
      person,
      mail,
      call,
      business,
      statsChart,
      create,
      settings,
      logOut,
    });
  }

  toggleEditarPerfil() {
    this.mostrarEditarPerfil = !this.mostrarEditarPerfil;
  }

  async sair() {
    const confirmado = await this.alertService.showConfirm(
      'Confirmar Saída',
      'Deseja realmente sair do aplicativo?'
    );

    if (confirmado) {
      await this.alertService.showSuccess('Até logo!');
    }
  }

  onPerfilSalvo() {
    this.mostrarEditarPerfil = false;
  }

  onPerfilCancelado() {
    this.mostrarEditarPerfil = false;
  }
}
