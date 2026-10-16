import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelManagementDashboardComponent } from './hostel-management-dashboard.component';

describe('HostelManagementDashboardComponent', () => {
  let component: HostelManagementDashboardComponent;
  let fixture: ComponentFixture<HostelManagementDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostelManagementDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostelManagementDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
