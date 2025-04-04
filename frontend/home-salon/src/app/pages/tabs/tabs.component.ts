import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { homeOutline, listOutline, settingsOutline } from 'ionicons/icons';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonicModule],

})
export class TabsComponent {

  constructor() { 
    addIcons({
      'home-outline': homeOutline,
      'list-outline': listOutline,
      'settings-outline': settingsOutline,
    });
  }

  ngOnInit() {}

}
