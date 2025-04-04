import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { HttpClient ,HttpClientModule} from '@angular/common/http';
import { Router } from '@angular/router';
import { SharedHeaderComponent } from 'src/app/shared-header/shared-header.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  imports: [IonContent,IonButtons,SharedHeaderComponent,IonBackButton, HttpClientModule,IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class CategoriesPage implements OnInit {
  categoryId: string | null = null;
  treatments: any[] = [];
  apiUrl:string='http://localhost:3000/api'
  constructor(private route: ActivatedRoute, private http: HttpClient,private router:Router) {}

  ngOnInit() {
    // Retrieve the `id` from the route parameters
    this.categoryId = this.route.snapshot.paramMap.get('id');
    console.log('Category ID:', this.categoryId);

    if (this.categoryId) {
      this.fetchTreatments(this.categoryId);
    }}


    fetchTreatments(id: string) {
      console.log
      const apiUrl = `${this.apiUrl}/categories/${id}/treatments`;
      this.http.get(apiUrl).subscribe(
        (response: any) => {
          this.treatments = response; // Assign the API response to the treatments array
          console.log('Treatments:', this.treatments);
        },
        (error) => {
          console.error('Error fetching treatments:', error);
        }
      );
    }
    onTreatmentSelect(treatmentId: any) {
      if (this.categoryId) {
        // Navigate to occation-offers with treatmentId and categoryId as query parameters
        this.router.navigate([`/occation-offers/${treatmentId}`], {
          queryParams: { categoryId: this.categoryId ,type:'treatment'},
        });
      }
    }

    

}
