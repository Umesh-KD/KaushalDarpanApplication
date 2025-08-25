import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BTERHODDashboardComponent } from './BTER-HOD-Dashboard.component';

describe('BTERHODDashboardComponent', () => {
  let component: BTERHODDashboardComponent;
  let fixture: ComponentFixture<BTERHODDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BTERHODDashboardComponent]
    });
    fixture = TestBed.createComponent(BTERHODDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
