
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient ,HttpClientModule} from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class LoginPage implements OnInit {

  phoneNumber: string = '';
  id: string | null = null;
  phone: string = ''; // To store the entered mobile number
  code: string = ''; // To store the entered OTP
  otpSent: boolean = false; // To track if OTP has been sent
  loginForm: FormGroup; // Reactive form
  contentType: string | null = null; // To store the type parameter
  user:any
  apiUrl:string= "http://localhost:3000/api"
  
  // otpSent: boolean = false;

  constructor(private fb:FormBuilder, private http: HttpClient,private router: Router, private route: ActivatedRoute) {   
        // Initialize the reactive form
        this.loginForm = this.fb.group({
          phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]], // 10-digit mobile number
          code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]], // 6-digit OTP
        });
  }



  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.contentType = params['contentType'];
      this.id = params['id'] // Retrieve the type parameter
      console.log('tyoe:', this.contentType);
    });
    this.user=JSON.stringify(localStorage.getItem('user'));
    console.log('user:', this.user);
  }

  sendOtp() {
    // this.router.navigate(['/registration'], {queryParams: {type: this.contentType,id:this.id}});
    const phone = `+91${this.loginForm.get('phone')?.value}`;
    console.log('Phone value from form:', this.loginForm.get('phone')?.value); // Debugging log
    console.log('Sending OTP to:', phone);
  
    if (this.loginForm.get('phone')?.valid) {
      this.http.post(`${this.apiUrl}/twilio/send-otp`, { phone }).subscribe(
        (response: any) => {
          console.log('OTP sent successfully:', response);
          this.otpSent = true; // Show the OTP input field
        },
        (error) => {
          console.error('Error sending OTP:', error);
        }
      );
    } 
  }
  
  verifyOtp() {
    this.router.navigate(['/registration'], {queryParams: {type: this.contentType,id:this.id}});

    const phone = `+91${this.loginForm.get('phone')?.value}`;
    const code = this.loginForm.get('code')?.value;
  //   if (this.loginForm.get('code')?.valid) {
  //     this.http.post(`${this.apiUrl}/twilio/verify-otp`, { phone, code }).subscribe(
  //       (response: any) => {
  //         console.log('OTP verified successfully:', response);
  //         if(Object.keys(response.user).length !== 0){
  //           localStorage.setItem('user', JSON.stringify(response.user));
  //           this.router.navigate(['/booking-details'], {queryParams: {contentType: this.contentType,id:this.id,phone:this.loginForm.get('phone')?.value}});
  //         }
  //         else
  //           this.router.navigate(['/registration'], {queryParams: {contentType: this.contentType,id:this.id,phone:this.loginForm.get('phone')?.value}});
  // },
  //       (error) => {
  //         console.error('Error verifying OTP:', error);
  //         alert('Failed to verify OTP. Please try again.');
  //       }
  //     );
  //   } else {
  //     alert('Please enter a valid 6-digit OTP.');
  //   }
  }
  }

