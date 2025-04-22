import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { IonButton, IonBackButton, IonHeader, IonToolbar, IonAlert, IonChip, IonInput, IonButtons, IonItem, IonContent } from '@ionic/angular/standalone';
import { ApiService } from 'src/app/services/api.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.page.html',
  styleUrls: ['./booking-details.page.scss'],
  standalone: true,
  providers: [ApiService],
  imports: [
    IonContent, IonButton,
    IonInput, IonButtons, IonChip,
    IonAlert, IonToolbar, IonItem,
    IonHeader,
    IonBackButton,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ProgressSpinnerModule
  ]
})
export class BookingDetailsPage implements OnInit {
  alertButtons: any[] = [];
  availableDates: string[] = [];
  availableSlots: string[] = [];
  bookingForm: FormGroup;
  selectedDate: string | null = null;
  selectedSlot: string | null = null;
  isAlertOpen = false;
  id: string | null = null;
  imageUrl: string | null = null;
  user: any;
  bookingId: any;
  historys: any;
  loading:boolean=false

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private alertController: AlertController,
    private apiService: ApiService,
    private router: Router
  ) {
    this.bookingForm = this.fb.group({
      selectedDate: [null, Validators.required],
      selectedSlot: [null, Validators.required],
      address: this.fb.group({
        flat: [''],
        area: [''],
        landmark: [''],
        pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
        city: ['']
      })
    });
  }

  ngOnInit() {
    this.generateAvailableDates();
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
      this.imageUrl = params['imageUrl'];
      this.bookingId = params['bookingId'];

      const userData = localStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
        if (this.user.address) {
          this.bookingForm.get('address')?.patchValue({
            flat: this.user.address.flat,
            area: this.user.address.area,
            landmark: this.user.address.landmark,
            pincode: this.user.address.pincode,
            city: this.user.address.city
          });
        }
      }

      this.getBookingDetails();
    });

    this.alertButtons = [
      {
        text: 'OK',
        handler: () => this.navigateToHome()
      }
    ];

    // Generate slots for today by default
    this.generateAvailableSlots();
  }

  selectDate(date: string) {
    this.selectedDate = date;
    this.bookingForm.get('selectedDate')?.setValue(date);
    this.generateAvailableSlots(date); // Regenerate slots based on selected date
  }

  selectSlot(slot: string) {
    this.selectedSlot = slot;
    this.bookingForm.get('selectedSlot')?.setValue(slot);
  }

  generateAvailableDates() {
    const today = new Date();
    this.availableDates = Array.from({ length: 8 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    });
  }

  generateAvailableSlots(selectedDate?: string) {
    const now = new Date();
    const startTime = new Date();
    const endTime = new Date();

    // Normalize dates for comparison
    const normalizedSelectedDate = selectedDate
      ? new Date(selectedDate).toLocaleDateString('en-US')
      : now.toLocaleDateString('en-US');
    const normalizedToday = now.toLocaleDateString('en-US');
    const isToday = normalizedSelectedDate === normalizedToday;

    // Set end time to 6:00 PM
    endTime.setHours(18, 0, 0, 0);

    if (isToday) {
      // For today, start from the next 30-minute interval
      startTime.setHours(now.getHours(), now.getMinutes(), 0, 0);
      if (now.getMinutes() > 30) {
        startTime.setHours(startTime.getHours() + 1, 0, 0, 0);
      } else {
        startTime.setMinutes(30, 0, 0);
      }
    } else {
      // For future dates, start at 10:00 AM
      startTime.setHours(10, 0, 0, 0);
    }

    const slots = [];
    while (startTime <= endTime) {
      slots.push(startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
      startTime.setMinutes(startTime.getMinutes() + 30);
    }

    this.availableSlots = slots;
  }

  // Rest of the methods (fetchServicesHistory, getBookingDetails, confirmSchedule, navigateToHome) remain unchanged
  fetchServicesHistory() {
    this.loading=true
    this.apiService.getServicesHistory(this.user._id).subscribe(
      (response: any) => {
        this.historys = response;
        this.loading=false;
        console.log('Services History:', response);
      },
      (error) => {
        this.loading=false;
        console.error('Error fetching services history:', error);
      }
    );
  }

  getBookingDetails() {
    if (this.bookingId) {
      this.loading=true
      this.apiService.getBookingDetails(this.bookingId).subscribe(
        (response: any) => {
          this.bookingForm.patchValue({
            selectedDate: response.selectedDate,
            selectedSlot: response.selectedSlot,
          });
          this.loading=false
          this.selectedDate = response.selectedDate;
          this.selectedSlot = response.selectedSlot;
          //  Generate available slots for the selected date
        this.generateAvailableSlots(response.selectedDate);
        },
        (error) => {
          this.loading=false
          console.error('Error fetching booking details:', error);
        }
      );
    }
  }

  confirmSchedule() {
    if (this.bookingForm.valid) {
      const formData = {
        ...this.bookingForm.value,
        status: 'confirmed',
        treatmentId: this.id,
        userId: this.user ? this.user._id : null,
        bookingId: this.bookingId,
      };

      if (this.bookingId) {
        this.loading=true
        this.apiService.resheduleBookings(formData).subscribe(
          (response: any) => {
            console.log(response);
            this.getBookingDetails();
            this.loading=false
            this.isAlertOpen = true;
          },
          (error: any) => {
            console.log(error);
          }
        );
      } else {
        this.apiService.createBooking(formData).subscribe(
          (response: any) => {
            console.log('Booking confirmed:', response);
            this.fetchServicesHistory();
            this.loading=false;
            this.isAlertOpen = true;
          },
          (error) => {
            this.loading=false
            console.error('Error confirming booking:', error);
          }
        );
      }
    } else {
      this.loading=false
      this.bookingForm.markAllAsTouched();
    }
    this.loading=false
    console.log('Booking form data:', this.bookingForm.value);
  }

  navigateToHome() {
    this.isAlertOpen = false;
    this.router.navigate(['/tabs/services']);
  }
}