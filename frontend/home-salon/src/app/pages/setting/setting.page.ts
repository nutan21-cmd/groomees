import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent,IonLabel, IonHeader, IonItem, IonToolbar, IonIcon, IonList, IonBackButton, IonButtons, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { chevronForward, createOutline, helpCircleOutline, informationCircleOutline, logOutOutline, notificationsOutline, personCircleOutline, phoneLandscape } from 'ionicons/icons';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
  standalone: true,
  imports: [IonContent,IonButton,IonBackButton,IonButtons,IonIcon,IonList,IonItem,IonLabel, IonHeader, IonToolbar, CommonModule, FormsModule]
})
export class SettingPage implements OnInit {
  username: string | null = null;
  user:any

  constructor(private router: Router) {
    addIcons({notificationsOutline,personCircleOutline, createOutline,chevronForward, informationCircleOutline , helpCircleOutline,logOutOutline});

  }

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if(userData) {
      this.user = JSON.parse(userData);
      this.username = `${this.user.firstName} ${this.user.lastName}`;

    } 

  }

  onNotificationsClick() {
    // Navigate to notifications page or handle notifications
  }

  onAboutClick() {
    this.router.navigate(['/about-us']);

    // Navigate to about page or show about modal
  }

  onHelpClick() {
    // Open help section or redirect to support
  }

  onLogout() {
    if(localStorage.getItem('user')) {
      
      localStorage.removeItem('user');
    }
    this.router.navigate(['/login']);

  }

  onEditProfile(){
    this.router.navigate(['/registration'], {queryParams: {profile: 'user','phone': this.user.phone,imageUrl:this.user.imageUrl}});
  // Navigate to edit profile page
  }


}
