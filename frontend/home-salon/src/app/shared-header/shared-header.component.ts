import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {  IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-shared-header',
  templateUrl: './shared-header.component.html',
  styleUrls: ['./shared-header.component.scss'],
  standalone: true,
  imports: [CommonModule,IonicModule]
})
export class SharedHeaderComponent  implements OnInit {
  @Input() showBackButton: boolean = false; // Optional input to override logic
  defaultHref: string = '/tabs/home'; // Default back button route

  constructor(private router: Router,  private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
        // Automatically determine if the back button should be shown based on the route
        const currentRoute = this.router.url;
        const routesWithoutBackButton = ['/tabs/home']; // Add routes where back button is not needed
        this.showBackButton = !routesWithoutBackButton.includes(currentRoute);

         // Set a default route for specific pages if not provided
      // Handle dynamic routes like /occation-offers/:id
      if (currentRoute.startsWith('/occation-offers/')) {
        // Extract the dynamic ID from the route and set the defaultHref
        this.activatedRoute.params.subscribe((params) => {
          const categoryId = params['id']; // Extract the dynamic ID
          if (categoryId) {
            this.defaultHref = `/categories/${categoryId}`; // Route back to the specific category
          } else {
            this.defaultHref = '/categories'; // Fallback if no ID is found
          }
        });
      }
    
      }
  }

