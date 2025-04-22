import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonButton, IonInput, IonItem, IonContent } from '@ionic/angular/standalone';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/user-services.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  providers: [ApiService, UserService],
  imports: [
    IonContent,
    IonButton,
    IonInput,
    IonItem,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
})
export class LoginPage implements OnInit, OnDestroy {
  @ViewChild('phoneInput') phoneInput!: IonInput;
  @ViewChild('otpInput', { static: false }) otpInput!: IonInput;

  phoneNumber: string = '';
  id: string | null = null;
  phone: string = '';
  code: string = '';
  otpSent: boolean = false;
  loginForm: FormGroup;
  user: any;
  imageUrl: string | null = null;
  private userSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private userService: UserService
  ) {
    this.loginForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  ionViewDidEnter() {
    this.phoneInput.setFocus();
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.imageUrl = params['imageUrl'];
      this.id = params['id'];
    });

    // Subscribe to user$ to get the current user
    this.userSubscription = this.userService.user$.subscribe((user) => {
      this.user = user;
      console.log('User from UserService:', user);
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  sendOtp() {
    const phone = `+91${this.loginForm.get('phone')?.value}`;
    if (this.loginForm.get('phone')?.valid) {
      this.apiService.sendOtp(phone).subscribe({
        next: (response: any) => {
          console.log('OTP sent successfully:', response);
          this.otpSent = true;
          setTimeout(() => {
            if (this.otpInput) {
              this.otpInput.setFocus().catch((err) => console.error('Failed to focus OTP input:', err));
            }
          }, 300);
        },
        error: (error) => {
          console.error('Error sending OTP:', error);
          alert('Failed to send OTP. Please try again.');
        },
      });
    } else {
      alert('Please enter a valid phone number.');
    }
  }

  verifyOtp() {
    const phone = `+91${this.loginForm.get('phone')?.value}`;
    const code = this.loginForm.get('code')?.value;

    if (this.loginForm.get('code')?.valid) {
      this.apiService.verifyOtp(phone, code).subscribe({
        next: (response: any) => {
          console.log('OTP verified successfully:', response);
          if (response.user && Object.keys(response.user).length !== 0) {
            this.userService.updateUser(response.user); // Update user in UserService
            if (this.imageUrl && this.id) {
              this.router.navigate(['/booking-details'], {
                queryParams: {
                  imageUrl: this.imageUrl,
                  id: this.id,
                  phone: this.loginForm.get('phone')?.value,
                },
                replaceUrl:true
              });
            } else {
              this.router.navigate(['/tabs/home'],{replaceUrl:true});
            }
          } else {
            this.router.navigate(['/registration'], {
              queryParams: {
                id: this.id,
                phone: this.loginForm.get('phone')?.value,
                imageUrl: this.imageUrl,
              },
              replaceUrl: true,
            });
          }
        },
        error: (error) => {
          console.error('Error verifying OTP:', error);
          alert('Failed to verify OTP. Please try again.');
        },
      });
    } else {
      alert('Please enter a valid 6-digit OTP.');
    }
  }
}