import { ComponentFixture, TestBed } from '@angular/core/testing';

import { itiDashboardComponent } from './iti-Dashboard.component';

describe('ItiPlanningLisitiDashboardComponenttComponent', () => {
  let component: itiDashboardComponent;
  let fixture: ComponentFixture<itiDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [itiDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(itiDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
