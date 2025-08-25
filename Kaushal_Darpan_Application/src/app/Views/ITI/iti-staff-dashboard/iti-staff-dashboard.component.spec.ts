import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiStaffDashboardComponent } from './iti-staff-dashboard.component';

describe('ItiStaffDashboardComponent', () => {
  let component: ItiStaffDashboardComponent;
  let fixture: ComponentFixture<ItiStaffDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItiStaffDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiStaffDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
