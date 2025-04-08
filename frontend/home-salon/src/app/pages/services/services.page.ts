import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {  IonIcon, IonBackButton, IonBadge, IonButtons, IonToolbar, IonCol, IonGrid, IonRow, IonContent, IonHeader } from '@ionic/angular/standalone';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { calendarOutline, refreshCircleOutline, closeCircleOutline } from 'ionicons/icons';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
  standalone: true,
  providers: [ApiService],
  imports: [ IonIcon, HttpClientModule, IonBadge, IonContent, IonHeader, IonContent, IonToolbar, IonGrid, IonRow, IonCol, IonBackButton, IonButtons, IonToolbar, CommonModule, FormsModule],
})
export class ServicesPage implements OnInit {
  historys: any[] = [];
  user: any;  
  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router,
    private apiService: ApiService
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
    this.apiService.getServicesHistory(this.user._id).subscribe(
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

  async rescheduleBooking(bookingId: string,treatment:any) {
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
            this.router.navigate(['/booking-details'], {
              queryParams: {
                contentType: treatment.contentType,
                id: treatment._id,
                imageUrl: treatment.imageUrl,
                phone: this.user.phone}});          }
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
            this.apiService.cancelBooking(bookingId).subscribe(
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