import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { IonicModule } from '@ionic/angular';
import { IonTabs,IonTabButton,IonLabel,IonTabBar ,IonIcon} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { homeOutline, laptopOutline, listOutline, peopleOutline, settingsOutline } from 'ionicons/icons';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule,
    IonTabButton,
    IonTabs,
    IonLabel,
    IonTabBar,
    IonIcon
  ],

})
export class TabsComponent {
  userData:any
  constructor() { 
    addIcons({
      'home-outline': homeOutline,
      'list-outline': listOutline,
      'settings-outline': settingsOutline,
      'laptop-outline': laptopOutline,
      'people-outline':peopleOutline
    });
  }

  ngOnInit() {
    console.log('TabsComponent ngOnInit called');
    const user = localStorage.getItem('user');
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      this.userData = JSON.parse(storedUserData);
      console.log('User Data:', this.userData);
    } else {
      this.userData = { TYPE: 'User' }; // Default for testing
      console.log('Default User Data:', this.userData);
    }}

}
