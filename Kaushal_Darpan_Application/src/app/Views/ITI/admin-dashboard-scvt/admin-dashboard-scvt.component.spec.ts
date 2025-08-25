import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardSCVTComponent } from './admin-dashboard-scvt.component';

describe('AdminDashboardSCVTComponent', () => {
  let component: AdminDashboardSCVTComponent;
  let fixture: ComponentFixture<AdminDashboardSCVTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardSCVTComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardSCVTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
