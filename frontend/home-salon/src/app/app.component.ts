import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    this.initializeApp();
  }

  async initializeApp() {
    try {
      await StatusBar.show();
      await StatusBar.setStyle({ style: Style.Light }); // Use Style.Dark if needed
    } catch (error) {
      console.error('Error showing status bar:', error);
    }
  }
}
