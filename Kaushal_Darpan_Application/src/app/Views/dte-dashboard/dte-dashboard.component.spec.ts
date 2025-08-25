import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DTEDashboardComponent } from './dte-dashboard.component';

describe('DTEDashboardComponent', () => {
  let component: DTEDashboardComponent;
  let fixture: ComponentFixture<DTEDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DTEDashboardComponent]
    });
    fixture = TestBed.createComponent(DTEDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
