import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JDTEDashboardComponent } from './jdte-dashboard.component';

describe('JDTEDashboardComponent', () => {
  let component: JDTEDashboardComponent;
  let fixture: ComponentFixture<JDTEDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JDTEDashboardComponent]
    });
    fixture = TestBed.createComponent(JDTEDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
