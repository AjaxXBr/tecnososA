import { Injectable, inject } from '@angular/core';
import { ToastController, AlertController, LoadingController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private loading: any;

  constructor() {}

  private toastController = inject(ToastController);
  private alertController = inject(AlertController);
  private loadingController = inject(LoadingController);

  async showToast(message: string, color: 'success' | 'danger' | 'warning' | 'primary' = 'success', duration: number = 3000) {
    const toast = await this.toastController.create({
      message,
      duration,
      color,
      position: 'top'
    });
    await toast.present();
  }

  async showAlert(header: string, message: string, buttons: any[] = ['OK']) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons
    });
    await alert.present();
  }

  async showConfirm(header: string, message: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header,
        message,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => resolve(false)
          },
          {
            text: 'Confirmar',
            handler: () => resolve(true)
          }
        ]
      });
      await alert.present();
    });
  }

  async showLoading(message: string = 'Carregando...') {
    this.loading = await this.loadingController.create({
      message,
      spinner: 'crescent'
    });
    await this.loading.present();
  }

  async hideLoading() {
    if (this.loading) {
      await this.loading.dismiss();
    }
  }

  async showError(mensagem: string, erro?: any) {
    console.error('Erro:', erro);
    await this.showToast(mensagem, 'danger', 5000);
  }

  async showSuccess(mensagem: string) {
    await this.showToast(mensagem, 'success');
  }
}