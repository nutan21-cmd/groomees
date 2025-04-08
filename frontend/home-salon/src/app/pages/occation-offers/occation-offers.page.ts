import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader,IonCardContent,IonCard, IonBackButton,IonButtons, IonButton, IonToolbar } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient ,HttpClientModule} from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-occation-offers',
  templateUrl: './occation-offers.page.html',
  styleUrls: ['./occation-offers.page.scss'],
  standalone: true,
  providers: [ApiService],
  imports: [IonContent,IonCardContent ,HttpClientModule,IonButton,IonCard, IonBackButton,IonButtons,IonContent,IonHeader, IonToolbar, CommonModule, FormsModule]
})
export class OccationOffersPage implements OnInit {
  bookingInfo: any;
  id: string | null = null;
  categoryId: string | null = null;
  imageUrl: string | null = null;
// type: any;
user: any;
  constructor(private route: ActivatedRoute,private apiService: ApiService, private router:Router,private http:HttpClient ) { }

  // Lifecycle hook - runs when component is initialized
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.route.queryParams.subscribe((params) => {
      this.categoryId = params['categoryId'];
      this.imageUrl = params['imageUrl'];      
      console.log('Category ID:', this.categoryId);
      const userData = localStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData); 
      }
    });
        this.fetchTreatment();  
  }

  // Method to handle booking process
  onBookNow() {
      if(!this.user){
      this.router.navigate(['/login'], { queryParams: { imageUrl: this.imageUrl,id: this.id } });
    }
    else{
      this.router.navigate(['/booking-details'], {
        queryParams: {
          imageUrl: this.imageUrl,
          id: this.id,
          phone: this.user.phone
        }
      });    }
  }

  // else{
  //   this.router.navigate(['/booking-details']
  // }


  fetchTreatment() {
    if (this.id) {
      this.apiService.getTreatmentBooking(this.id).subscribe(
      (response: any) => {
        this.bookingInfo = response; // Assign the API response to the treatments array
        console.log('treatment:', this.bookingInfo);
        (error:any) => {
          console.log('Error fetching treatment:', error);
        };
      }
        );
      } 
   
  }
}
