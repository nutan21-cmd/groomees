import { ChangeDetectorRef, Component ,OnDestroy} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { IonicModule } from '@ionic/angular';
import { IonTabs,IonTabButton,IonLabel,IonTabBar ,IonIcon} from '@ionic/angular/standalone';
import { UserService } from 'src/app/user-services.service';
import { addIcons } from 'ionicons';
import { homeOutline, laptopOutline, listOutline, peopleOutline, settingsOutline } from 'ionicons/icons';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: true,
  providers:[UserService],
  imports: [CommonModule, RouterModule,
    IonTabButton,
    IonTabs,
    IonLabel,
    IonTabBar,
    IonIcon
  ],

})
export class TabsComponent implements OnDestroy {
  userData: any = {};
  private userSubscription!: Subscription;
  // userData:any
  constructor(private userService:UserService,private cdr: ChangeDetectorRef) { 
    addIcons({
      'home-outline': homeOutline,
      'list-outline': listOutline,
      'settings-outline': settingsOutline,
      'laptop-outline': laptopOutline,
      'people-outline':peopleOutline
    });
  }

  ngOnInit() {
    this.userSubscription = this.userService.user$.subscribe((user) => {
      this.userData = user || {};
      console.log('User data in tabs:', this.userData);
      this.cdr.detectChanges(); // Trigger change detection
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

}
