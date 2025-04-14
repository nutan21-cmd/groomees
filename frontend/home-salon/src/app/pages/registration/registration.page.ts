import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonButton, IonInput, IonLabel, IonItem, IonHeader, IonToolbar, IonButtons, IonBackButton, IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/user-services.service';
import { Subscription } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
  standalone: true,
  providers: [ApiService, UserService],
  imports: [
    IonContent,
    IonButton,
    IonInput,
    IonLabel,
    IonItem,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    ProgressSpinnerModule,
  ],
})
export class RegistrationPage implements OnInit, OnDestroy {
  registrationForm!: FormGroup;
  phone!: string;
  user: any;
  id: string | null = null;
  profile: any;
  userData: any;
  imageUrl: any;
  loading: boolean = false;
  private userSubscription!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private userService: UserService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
      this.profile = params['profile'];
      this.phone = params['phone'];
      this.imageUrl = params['imageUrl'];

      if (this.profile === 'user') {
        this.editUserProfile();
      }
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  editUserProfile() {
    this.loading = true;
    this.userSubscription = this.userService.user$.subscribe((user) => {
      this.userData = user;
      console.log(this.userData, 'from userservice');
      if (this.userData) {
        this.registrationForm.patchValue({
          firstName: this.userData.firstName || '',
          lastName: this.userData.lastName || '',
          email: this.userData.email || '',
          flat: this.userData.address?.flat || '',
          area: this.userData.address?.area || '',
          landmark: this.userData.address?.landmark || '',
          pincode: this.userData.address?.pincode || '',
          city: this.userData.address?.city || '',
        });
      }
      this.loading = false;
    });
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
      city: ['', [Validators.required]],
    });
  }

  get f() {
    return this.registrationForm.controls;
  }

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
    this.loading = true;
    this.apiService.registerUser(payload).subscribe(
      (response: any) => {
        console.log('Registration successful:', response);
        this.userService.updateUser(response); // Update UserService
        this.loading = false;
        this.navigateToNextPage();
      },
      (error) => {
        console.error('Error registering user:', error);
        this.loading = false;
      }
    );
  }

  updateUserProfile(payload: any) {
    console.log(payload)
    // payload.TYPE='Admin'
    this.loading = true;
    this.apiService.updateUserProfile(payload, this.userData?._id).subscribe(
      (response: any) => {
        console.log('Profile updated successfully:', response);
        this.userService.updateUser(response); // Update UserService
        this.loading = false;
        this.navigateToNextPage();
      },
      (error) => {
        console.error('Error updating profile:', error);
        this.loading = false;
      }
    );
  }

  navigateToNextPage() {
    if (this.profile === 'user') {
      this.router.navigate(['/tabs/setting']);
    } else {
      if (this.id && this.imageUrl) {
        this.router.navigate(['/booking-details'], {
          queryParams: {
            id: this.id,
            phone: this.phone,
            imageUrl: this.imageUrl,
          },
        });
      } else {
        this.router.navigate(['/tabs/home']);
      }
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