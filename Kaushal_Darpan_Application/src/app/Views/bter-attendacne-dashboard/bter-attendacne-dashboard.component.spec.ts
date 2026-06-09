import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BterAttendanceDashboardComponent } from './bter-attendacne-dashboard.component';

describe('PlacementDashboardComponent', () => {
  let component: BterAttendanceDashboardComponent;
  let fixture: ComponentFixture<BterAttendanceDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BterAttendanceDashboardComponent]
    });
    fixture = TestBed.createComponent(BterAttendanceDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
