import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodalDashboardITIComponent } from './nodal-dashboard-iti.component';

describe('NodalDashboardITIComponent', () => {
  let component: NodalDashboardITIComponent;
  let fixture: ComponentFixture<NodalDashboardITIComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NodalDashboardITIComponent]
    });
    fixture = TestBed.createComponent(NodalDashboardITIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
