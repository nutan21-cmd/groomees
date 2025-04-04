import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OccationOffersPage } from './occation-offers.page';

describe('OccationOffersPage', () => {
  let component: OccationOffersPage;
  let fixture: ComponentFixture<OccationOffersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OccationOffersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
