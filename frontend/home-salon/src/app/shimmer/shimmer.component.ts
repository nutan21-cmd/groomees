import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shimmer',
  templateUrl: './shimmer.component.html',
  styleUrls: ['./shimmer.component.scss'],
  imports: [CommonModule]
})
export class ShimmerComponent  implements OnInit {
  @Input() type: 'card' | 'image' | 'text' | 'banner' | 'category' | 'package' = 'card';
  @Input() count: number = 1;
  countArray: number[] = [];

  constructor() { }

  ngOnInit() {
    this.countArray = Array(this.count).fill(0).map((_, i) => i);

  }

}
