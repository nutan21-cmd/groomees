import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonLabel, IonHeader, IonItem, IonToolbar, IonIcon, IonList, IonBackButton, IonButtons, IonButton } from '@ionic/angular/standalone';
import { Router, NavigationEnd } from '@angular/router';
import { addIcons } from 'ionicons';
import { chevronForward, createOutline, helpCircleOutline, informationCircleOutline, logOutOutline, logInOutline, notificationsOutline, personCircleOutline } from 'ionicons/icons';
import { UserService } from 'src/app/user-services.service';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
  standalone: true,
  providers: [UserService],
  imports: [IonContent, IonButton, IonBackButton, IonButtons, IonIcon, IonList, IonItem, IonLabel, IonHeader, IonToolbar, CommonModule, FormsModule],
})
export class SettingPage implements OnInit, OnDestroy {
  username: string | null = null;
  user: any;
  private userSubscription: Subscription | undefined;
  private routerSubscription: Subscription | undefined;

  constructor(private router: Router, private userService: UserService) {
    addIcons({
      notificationsOutline,
      personCircleOutline,
      logInOutline,
      createOutline,
      chevronForward,
      informationCircleOutline,
      helpCircleOutline,
      logOutOutline,
    });
  }

  ngOnInit() {
    // Initialize user subscription
    this.userSubscription = this.userService.user$.subscribe((user) => {
      this.user = user;
      this.updateUsername();
    });

    // Subscribe to router events to ensure username updates on navigation
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects.includes('/tabs/setting')) {
          this.userService.loadUser(); // Ensure latest user data
          // this.updateUsername();
        }
      });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  updateUsername() {
    if (this.user?._id) {
      this.username = `${this.user.firstName} ${this.user.lastName}`;
      console.log('Updated username:', this.username);
    } else {
      this.username = null;
    }
  }

  onNotificationsClick() {
    // Navigate to notifications page or handle notifications
  }

  onAboutClick() {
    this.router.navigate(['/about-us']);
  }

  onHelpClick() {
    // Open help section or redirect to support
  }

  onLogout() {
    this.userService.clearUser(); // Use UserService to clear user
    this.router.navigate(['/tabs/home']);
  }

  onLogIn() {
    this.router.navigate(['/login']);
  }

  onEditProfile() {
    this.router.navigate(['/registration'], {
      queryParams: { profile: 'user', phone: this.user?.phone, imageUrl: this.user?.imageUrl },
    });
  }
}