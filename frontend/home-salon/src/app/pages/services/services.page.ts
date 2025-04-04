import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCard, IonIcon, IonBackButton, IonBadge, IonButtons, IonToolbar, IonTitle, IonCardContent, IonLabel, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonRow, IonContent, IonHeader } from '@ionic/angular/standalone';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { calendarOutline, refreshCircleOutline, closeCircleOutline } from 'ionicons/icons';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
  standalone: true,
  imports: [IonCard, IonIcon, HttpClientModule, IonBadge, IonLabel, IonContent, IonCardContent, IonHeader, IonContent, IonToolbar, IonCardHeader, IonCardSubtitle, IonCardTitle, IonGrid, IonRow, IonCol, IonBackButton, IonButtons, IonToolbar, IonTitle, CommonModule, FormsModule],
})
export class ServicesPage implements OnInit {
  historys: any[] = [];
  user: any;
  apiUrl: string = "http://localhost:3000/api";
  
  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    addIcons({
      'calendar-outline': calendarOutline,
      'refresh-circle-outline': refreshCircleOutline,
      'close-circle-outline': closeCircleOutline
    });
  }

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }

    this.fetchServicesHistory();
  }
  
  fetchServicesHistory() {
    const apiUrl = `${this.apiUrl}/bookings/user/${this.user._id}`;
    this.http.get(apiUrl).subscribe(
      (response: any) => {
        this.historys = response;
        console.log('Services History:', response);
      },
      (error) => {
        console.error('Error fetching services history:', error);
        this.showToast('Could not load booking history. Please try again later.');
      }
    );
  }

  async rescheduleBooking(bookingId: string) {
    const alert = await this.alertController.create({
      header: 'Reschedule Appointment',
      message: 'Are you sure you want to reschedule this appointment?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Reschedule',
          handler: () => {
            // Navigate to reschedule page or open reschedule modal
            console.log('Reschedule booking:', bookingId);
            this.showToast('Redirecting to reschedule page...');
            // Add your navigation logic here
          }
        }
      ]
    });

    await alert.present();
  }

  async cancelBooking(bookingId: string) {
    const alert = await this.alertController.create({
      header: 'Cancel Appointment',
      message: 'Are you sure you want to cancel this appointment?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes, Cancel',
          handler: () => {
            const cancelUrl = `${this.apiUrl}/bookings/${bookingId}/cancel`;
            this.http.put(cancelUrl, {}).subscribe(
              (response: any) => {
                console.log('Booking cancelled:', response);
                this.showToast('Your appointment has been cancelled successfully.');
                this.fetchServicesHistory(); // Refresh the list
              },
              (error) => {
                console.error('Error cancelling booking:', error);
                this.showToast('Could not cancel your appointment. Please try again later.');
              }
            );
          }
        }
      ]
    });

    await alert.present();
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: 'dark'
    });
    toast.present();
  }
}