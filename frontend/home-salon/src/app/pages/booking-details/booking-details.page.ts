import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient ,HttpClientModule} from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { IonButton,IonBackButton,IonHeader,IonToolbar,IonAlert,IonChip,IonInput,IonButtons, IonItem, IonContent } from '@ionic/angular/standalone';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.page.html',
  styleUrls: ['./booking-details.page.scss'],
  standalone: true,
  providers: [ApiService],
  imports: [
    IonContent, IonButton, 
    IonInput, IonButtons,IonChip,
    IonAlert,IonToolbar,IonItem, 
    IonHeader,
    IonBackButton,
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class BookingDetailsPage implements OnInit {
  alertButtons: any[] = []; // Define the buttons array

  availableDates = ['Feb 13', 'Feb 14', 'Feb 15', 'Feb 16', 'Feb 17', 'Feb 18', 'Feb 19', 'Feb 20', 'Feb 21', 'Feb 22'];
  availableSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'];
  bookingForm: FormGroup; // Reactive form
  selectedDate: string | null = null;
  selectedSlot: string | null = null;
  isAlertOpen = false;
  id: string | null = null;
  imageUrl: string | null = null;
  apiUrl:string='http://34.131.137.64/api'
  user:any
  constructor(private route: ActivatedRoute,
     private fb: FormBuilder,
      private http: HttpClient,
      private alertController: AlertController,
      private apiService: ApiService,
      private router: Router) {   
    this.bookingForm = this.fb.group({
      selectedDate: [null, Validators.required],
      selectedSlot: [null, Validators.required],
      address: this.fb.group({
        flat: ['', Validators.required],
        area: ['', Validators.required],
        landmark: [''],
        pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]], // Only 6-digit numeric values
        city: ['', Validators.required]
      })
    }); 
}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
      this.imageUrl = params['imageUrl'];
        // Check if address exists in local storage
  const userData = localStorage.getItem('user');
  if (userData) {
    this.user = JSON.parse(userData); // Parse the stored JSON string
    if (this.user.address) {
      // Patch the form with the stored address
      this.bookingForm.get('address')?.patchValue({
        flat: this.user.address.flat,
        area: this.user.address.area,
        landmark: this.user.address.landmark,
        pincode: this.user.address.pincode,
        city: this.user.address.city
      });
    }
  }
    });

    this.alertButtons = [
      {
        text: 'OK',
        handler: () => this.navigateToHome() // Reference the navigation method
      }
    ];

  }

  selectDate(date: string) {
    this.selectedDate = date;
    this.bookingForm.get('selectedDate')?.setValue(date); // Update the form control
  }
  
  selectSlot(slot: string) {
    this.selectedSlot = slot;
    this.bookingForm.get('selectedSlot')?.setValue(slot); // Update the form control
  }

  confirmSchedule() {
    if (this.bookingForm.valid) {
      const formData = {
        ...this.bookingForm.value,
        status: 'confirmed',
        treatmentId: this.id,
        userId: this.user ? this.user._id : null,
      };
  
      this.apiService.createBooking(formData).subscribe(
        (response: any) => {
          console.log('Booking confirmed:', response);
          this.isAlertOpen = true; // Open the alert
        },
        (error) => {
          console.error('Error confirming booking:', error);
        }
      );
    } else {
      // Mark all fields as touched to trigger validation messages
      this.bookingForm.markAllAsTouched();
    }
    console.log('Booking form data:', this.bookingForm.value);
  }
  
  navigateToHome() {
    this.isAlertOpen = false; // Close the alert
    this.router.navigate(['/tabs/home']); // Navigate to the home page
  }





  }

