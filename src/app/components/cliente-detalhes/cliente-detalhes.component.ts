import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonAvatar,
  IonButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  person,
  call,
  mail,
  location,
  hardwareChip,
  construct,
  arrowBack,
  create,
} from 'ionicons/icons';
import { Cliente } from '../../models/cliente';
import { EquipamentoService } from '../../services/equipamento.service';
import { OsService } from '../../services/os.service';
import { AlertService } from '../../services/alert.service';
import { TimestampPipe } from '../../pipes/timestamp.pipe';

@Component({
  selector: 'app-cliente-detalhes',
  templateUrl: './cliente-detalhes.component.html',
  styleUrls: ['./cliente-detalhes.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonAvatar,
    IonButton,
    TimestampPipe,
  ],
})
export class ClienteDetalhesComponent {
  @Input() cliente!: Cliente;
  @Output() voltar = new EventEmitter<void>();
  @Output() editar = new EventEmitter<Cliente>();

  private equipamentoService = inject(EquipamentoService);
  private osService = inject(OsService);
  private alertService = inject(AlertService);

  estatisticas = {
    totalEquipamentos: 0,
    totalOS: 0,
  };

  constructor() {
    addIcons({
      person,
      call,
      mail,
      location,
      hardwareChip,
      construct,
      arrowBack,
      create,
    });
  }

  ngOnInit() {
    this.carregarEstatisticas();
  }

  async carregarEstatisticas() {
    if (this.cliente.id) {
      try {
        this.equipamentoService
          .obterEquipamentosPorCliente(this.cliente.id)
          .subscribe((equipamentos) => {
            this.estatisticas.totalEquipamentos = equipamentos.length;
          });

        this.osService.obterOSPorCliente(this.cliente.id).subscribe((os) => {
          this.estatisticas.totalOS = os.length;
        });
      } catch (error) {
        await this.alertService.showError('Erro ao carregar estatísticas');
      }
    }
  }

  onVoltar() {
    this.voltar.emit();
  }

  onEditar() {
    this.editar.emit(this.cliente);
  }
}
