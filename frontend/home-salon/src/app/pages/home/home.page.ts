import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonContent,
  IonLabel,
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { homeOutline, listOutline, settingsOutline } from 'ionicons/icons';
import { register } from 'swiper/element/bundle';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ShimmerComponent } from '../../shimmer/shimmer.component';
import { SkeletonModule } from 'primeng/skeleton';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent,
      IonLabel, RouterModule, IonHeader, IonToolbar, CommonModule,
    FormsModule,HttpClientModule,ProgressSpinnerModule,ShimmerComponent,SkeletonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ApiService],
})

export class HomePage implements OnInit {
  loading: boolean = false;
  categories: any[] = [];
  treatments: any[] = [];
  packages: any[] = [];
  banners:any[] = [];
  contentTypeData:any
  constructor(private router: Router, private http: HttpClient,private apiService: ApiService) {
    addIcons({ homeOutline, settingsOutline, listOutline });
  }

  ngOnInit() {
    register();
    this.fetchCategories();
    this.fetchAllTreatments();
    // this.fetchOffers();
  }
  fetchCategories() {
    this.loading = true;
    this.apiService.getCategories().subscribe({
      next: (response: any) => {
        this.categories = response;
        console.log('Categories:', this.categories);
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error('Error fetching categories:', error);
      }
    });
  }

  fetchAllTreatments() {
    this.loading = true;
    this.apiService.getTreatments().subscribe({
      next: (response: any) => {
        this.treatments = response;
        this.filterData();
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error('Error fetching treatments:', error);
      }
    });
  }

  filterData(){
   const treatment = this.treatments.filter((item:any) => item.type === "TREATMENT");
   const offers = this.treatments.filter(item => item.type === "OFFER");
   const packages =  this.treatments.filter(item => item.type === "PACKAGE");

this.contentTypeData = {
    TREATMENT: treatment,
    OFFER: offers,
    PACKAGE: packages
};
  }

  onCategoriesSelect(id: string) {
    console.log(`Selected service: ${id}`);
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/categories', id], { queryParams: { categoryId: id } });
    });    console.log('catid',id);

    this.router.navigateByUrl(`/categories/${id}?categoryId:${id}`);

  }
  
  onPackageSelect(selectedPackage: any) {
    console.log(`Selected package: ${selectedPackage._id}`);
    this.router.navigate([`/occation-offers/${selectedPackage._id}`], {
      queryParams: {
        id: selectedPackage._id,
        imageUrl: selectedPackage.imageUrl
      }
    });
  }
  
  navigateToBannerDetail(selectedBanner: any) {
    console.log(`Navigating to banner detail: ${selectedBanner._id}`);
    this.router.navigate([`/occation-offers/${selectedBanner._id}`], {
      queryParams: {
        id: selectedBanner._id,
        imageUrl: selectedBanner.imageUrl
      }
    });  }
}
