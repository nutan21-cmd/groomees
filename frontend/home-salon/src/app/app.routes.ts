import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.component').then((m) => m.TabsComponent),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'services',
        loadComponent: () => import('./pages/services/services.page').then((m) => m.ServicesPage),
      },
      {
        path: 'setting',
        loadComponent: () => import('./pages/setting/setting.page').then((m) => m.SettingPage),
      },
      {
        path: 'listings',
        loadComponent: () => import('./pages/listings/listings.page').then( m => m.ListingsPage)
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/users/users.page').then( m => m.UsersPage)
      },
      {
        path: '',
        redirectTo: 'home', // Redirect to 'home' when navigating to '/tabs'
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'about-us',
    loadComponent: () => import('./pages/about-us/about-us.page').then( m => m.AboutUsPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'booking-details',
    loadComponent: () => import('./pages/booking-details/booking-details.page').then( m => m.BookingDetailsPage)
  },
  {
    path: 'occation-offers/:id',
    loadComponent: () => import('./pages/occation-offers/occation-offers.page').then( m => m.OccationOffersPage)
  },
  {
    path: 'categories/:id',
    loadComponent: () => import('./pages/categories/categories.page').then( m => m.CategoriesPage)
  },
  {
    path: 'registration',
    loadComponent: () => import('./pages/registration/registration.page').then( m => m.RegistrationPage)
  }
];
