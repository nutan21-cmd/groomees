import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader,IonCardContent,IonCard, IonBackButton,IonButtons, IonButton, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient ,HttpClientModule} from '@angular/common/http';
import { SharedHeaderComponent } from 'src/app/shared-header/shared-header.component';
import { query } from 'express';
@Component({
  selector: 'app-occation-offers',
  templateUrl: './occation-offers.page.html',
  styleUrls: ['./occation-offers.page.scss'],
  standalone: true,
  imports: [IonContent, SharedHeaderComponent,IonCardContent ,HttpClientModule,IonButton,IonCard, IonBackButton,IonButtons,IonContent,IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class OccationOffersPage implements OnInit {
  bookingInfo: any;
  id: string | null = null;
  categoryId: string | null = null;
type: any;
  constructor(private route: ActivatedRoute, private router:Router,private http:HttpClient ) { }

  // Lifecycle hook - runs when component is initialized
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.route.queryParams.subscribe((params) => {
      this.categoryId = params['categoryId'];
      this.type = params['type']; // Retrieve the type parameter
      console.log('Category ID:', this.categoryId);
    });
      // Call the appropriate API based on the type
        this.fetchTreatment();
     
    // Any initialization logic can go here
  }

  // Method to handle booking process
  onBookNow() {

    // this.router.navigate(['/booking-details'],{
    //   queryParams: { id: this.id ,imageUrl:this.bookingInfo.imageUrl,contentType:this.type },
    // });
    this.router.navigate(['/login'], { queryParams: { contentType: this.type,id: this.id } });
    // Example booking logic
    // You can replace this with actual navigation or booking service
    console.log('Book Now button clicked');
    
    // Example of navigation to another page
    // this.navCtrl.navigateForward('/booking');
    
    // You might want to open a modal or call a booking service
    // this.openBookingModal();
  }

  // Optional: Method to open a booking modal
  // openBookingModal() {
  //   // Implement modal opening logic
  // }

  fetchTreatment() {
    const apiUrl = `http://localhost:3000/api/treatments/${this.id}`;
    console.log(`treatmentId,${this.id}`,'catid',this.categoryId);
    this.http.get(apiUrl).subscribe(
      (response: any) => {
        this.bookingInfo = response; // Assign the API response to the treatments array
        console.log('treatment:', this.bookingInfo);
      },
      (error) => {
        console.error('Error fetching treatments:', error);
      }
    );
  }
}
