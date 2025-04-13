import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { IonicModule } from '@ionic/angular';
import { IonButton, IonInput, IonLabel,IonItem, IonList, IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HttpClient ,HttpClientModule} from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
  standalone: true,
providers: [ApiService],
  imports: [
    IonContent, IonButton, IonInput,IonLabel, IonItem, 
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
})

export class RegistrationPage implements OnInit {
  registrationForm!: FormGroup;
  phone!: string; // Default phone number
  user:any
  id: string | null = null;
  profile: any;
  userData:any
  constructor(private formBuilder: FormBuilder,private router:Router, private apiService:ApiService, private route:ActivatedRoute) {
    this.createForm()
  }
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.id = params['id']; // Retrieve the type parameter
      this.profile = params['profile']; // Retrieve the type parameter
      this.phone = params['phone']; // Retrieve the type parameter

      this.editUserProfile()
    });
  }

  editUserProfile(){
    if(this.profile === 'user') {
      const user = localStorage.getItem('user');
      if(user) {
        this.userData = JSON.parse(user);
        this.registrationForm.patchValue({
          firstName: this.userData.firstName,
          lastName: this.userData.lastName,
          email: this.userData.email,
          flat: this.userData.address.flat,
          area: this.userData.address.area,
          landmark: this.userData.address.landmark,
          pincode: this.userData.address.pincode,
          city: this.userData.address.city
        });
      }
    }
  }

  createForm() {
    this.registrationForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      flat: ['', [Validators.required]],
      area: ['', [Validators.required]],
      landmark: [''],
      pincode: ['', [Validators.required, Validators.pattern('[0-9]{6}')]],
      city: ['', [Validators.required]]
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.registrationForm.controls; }

  validateForm() {
    if (this.registrationForm.invalid) {
      Object.keys(this.registrationForm.controls).forEach((key) => {
        const control = this.registrationForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
      return false;
    }
    return true;
  }

  generatePayload() {
    const formData = this.registrationForm.value;
    const registrationData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      address: {
        flat: formData.flat,
        area: formData.area,
        landmark: formData.landmark,
        pincode: formData.pincode,
        city: formData.city,
      },
    };

    if (this.profile === 'user') {
      return { ...registrationData, phone: this.phone, id: this.id };
    } else {
      return { ...registrationData, phone: this.phone };
    }
  }

  registerUser(payload: any) {
    this.apiService.registerUser(payload).subscribe(
      (response: any) => {
        console.log('Registration successful:', response);
        localStorage.setItem('user', JSON.stringify(response));
        this.navigateToNextPage();
      },
      (error) => {
        console.error('Error registering user:', error);
      }
    );
  }
 
  

  updateUserProfile(payload: any) {
    this.apiService.updateUserProfile(payload, this.userData._id).subscribe(
      (response: any) => {
        console.log('Profile updated successfully:', response);
        localStorage.setItem('user', JSON.stringify(response));
        this.navigateToNextPage();
      },
      (error) => {                
        console.error('Error updating profile:', error);
      }
    );
  }

  navigateToNextPage() {
    if(this.profile === 'user'){
      this.router.navigate(['/tabs/setting'])
    }
    else{
      this.router.navigate(['/booking-details'], {
        queryParams: { id: this.id },
      });
    }
  
  }

  submitForm() {
    if (!this.validateForm()) {
      return;
    }

    const payload = this.generatePayload();

    if (this.profile === 'user') {
      this.updateUserProfile(payload);
    } else {
      this.registerUser(payload);
    }
  }
}
