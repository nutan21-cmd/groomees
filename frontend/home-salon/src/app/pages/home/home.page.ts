import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonCard, IonTitle, IonToolbar, IonContent,
  IonTabs,
  IonCardContent,
  IonLabel,
  IonItem,
  IonCol,
  IonRow,
  IonGrid,
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { homeOutline, listOutline, settingsOutline } from 'ionicons/icons';
import { register } from 'swiper/element/bundle';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedHeaderComponent } from 'src/app/shared-header/shared-header.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent,
    IonTabs, IonCard, IonCol, IonRow, IonGrid, IonItem, IonLabel, IonCardContent, RouterModule, IonHeader, IonTitle, IonToolbar, CommonModule,
    FormsModule,SharedHeaderComponent,HttpClientModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class HomePage implements OnInit {
  // currentSlide = 0;
  categories: any[] = [];
  treatments: any[] = [];
  packages: any[] = [];
  banners:any[] = [];
  contentTypeData:any
  apiUrl:string='http://localhost:3000/api'
  constructor(private router: Router, private http: HttpClient) {
    addIcons({ homeOutline, settingsOutline, listOutline });

  }

  ngOnInit() {
    register();
    this.fetchCategories();
    this.fetchAllTreatments();
    // this.fetchOffers();
  }

  fetchCategories() {
    this.http.get(`${this.apiUrl}/categories`).subscribe(
      (response: any) => {
        this.categories = response; // Assign the API response to the categories array
        console.log('Categories:', this.categories);
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }
  fetchAllTreatments() {
    this.http.get(`${this.apiUrl}/treatments`).subscribe(
      (response: any) => {
        this.treatments = response;
        this.filterData() // Assign the API response to the categories array
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
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

  // fetchOffers() {
  //   this.http.get(`${this.apiUrl}/offers`).subscribe(
  //     (response: any) => {
  //       this.banners = response; // Assign the API response to the categories array
  //       console.log('Categories:', this.banners);
  //     },
  //     (error) => {
  //       console.error('Error fetching categories:', error);
  //     }
  //   );
  // }
  onCategoriesSelect(id: string) {
    console.log(`Selected service: ${id}`);
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/categories', id], { queryParams: { categoryId: id } });
    });    console.log('catid',id);

    this.router.navigateByUrl(`/categories/${id}?categoryId:${id}`);

  }
  
  onPackageSelect(id: string) {
    console.log(`Selected package: ${id}`);
    this.router.navigateByUrl(`/occation-offers/${id}?type=package`);
    console.log('pkg',id);

  }
  
  navigateToBannerDetail(id: string) {
    console.log(`Navigating to banner detail: ${id}`);
    this.router.navigateByUrl(`/occation-offers/${id}?type=offer`);
  }



}
