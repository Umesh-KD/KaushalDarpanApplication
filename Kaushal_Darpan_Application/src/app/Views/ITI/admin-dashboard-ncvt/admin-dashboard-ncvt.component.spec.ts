import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardNcvtComponent } from './admin-dashboard-ncvt.component';

describe('AdminDashboardNcvtComponent', () => {
  let component: AdminDashboardNcvtComponent;
  let fixture: ComponentFixture<AdminDashboardNcvtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminDashboardNcvtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardNcvtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
