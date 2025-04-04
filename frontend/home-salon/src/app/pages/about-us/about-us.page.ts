import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons,IonBackButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
  standalone: true,
  imports: [IonContent,IonButtons,IonBackButton, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AboutUsPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }


}
