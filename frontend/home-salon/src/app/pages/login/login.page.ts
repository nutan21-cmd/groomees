import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonButton, IonInput, IonItem, IonContent } from '@ionic/angular/standalone';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  providers: [ApiService],
  imports: [
    IonContent, IonButton, IonInput, IonItem, 
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class LoginPage implements OnInit {
  @ViewChild('phoneInput') phoneInput!: IonInput;
  @ViewChild('otpInput', { static: false }) otpInput!: IonInput;

  phoneNumber: string = '';
  id: string | null = null;
  phone: string = ''; // To store the entered mobile number
  code: string = ''; // To store the entered OTP
  otpSent: boolean = false; // To track if OTP has been sent
  loginForm: FormGroup; // Reactive form
  user: any;
  imageUrl: string | null = null; // To store the image URL
  
  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {   
    // Initialize the reactive form
    this.loginForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]], // 10-digit mobile number
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]], // 6-digit OTP
    });
  }
  ionViewDidEnter() {
    this.phoneInput.setFocus();
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.imageUrl = params['imageUrl'];
      this.id = params['id']; // Retrieve the type parameter
    });
    
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        this.user = JSON.parse(userString);
      } catch (e) {
        console.error('Error parsing user data:', e);
        this.user = null;
      }
    }
    console.log('user:', this.user);
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
              this.otpInput.setFocus().catch(err => console.error('Failed to focus OTP input:', err));
            }
          }, 300);
        },
        error: (error) => {
          console.error('Error sending OTP:', error);
        }
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
            localStorage.setItem('user', JSON.stringify(response.user));
            this.router.navigate(['/booking-details'], {
              queryParams: {
                imageUrl: this.imageUrl,
                id: this.id,
                phone: this.loginForm.get('phone')?.value
              }
            });
          } else {
            this.router.navigate(['/registration'], {
              queryParams: {
                id: this.id,
                phone: this.loginForm.get('phone')?.value
              }
            });
          }
        },
        error: (error) => {
          console.error('Error verifying OTP:', error);
          alert('Failed to verify OTP. Please try again.');
        }
      });
    } else {
      alert('Please enter a valid 6-digit OTP.');
    }
  }
}