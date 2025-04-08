import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonToolbar } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule} from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  providers: [ApiService],
  imports: [IonContent,IonButtons,IonBackButton, HttpClientModule,IonHeader, IonToolbar, CommonModule, FormsModule]
})
export class CategoriesPage implements OnInit {
  categoryId: string | null = null;
  treatments: any[] = [];
  constructor(private route: ActivatedRoute,private router:Router,private apiService:ApiService) {}

  ngOnInit() {
    // Retrieve the `id` from the route parameters
    this.categoryId = this.route.snapshot.paramMap.get('id');
    console.log('Category ID:', this.categoryId);

    if (this.categoryId) {
      this.fetchTreatments(this.categoryId);
    }}


    fetchTreatments(id: string) {
      this.apiService.getTreatmentsbyCategory(id).subscribe((response: any) => {
        this.treatments = response; // Assign the API response to the treatments array
        console.log('Treatments:', this.treatments);
      }, (error) => {
        console.error('Error fetching treatments:', error);
      });
    }
    onTreatmentSelect(treatment: any) {
      if (this.categoryId) {
        // Navigate to occation-offers with treatmentId and categoryId as query parameters
        this.router.navigate([`/occation-offers/${treatment._id}`], {
          queryParams: { categoryId: this.categoryId ,imageUrl:treatment.imageUrl}, 
        });
      }
    }

    

}
