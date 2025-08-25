import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterSuperintendentStudentReportComponent } from './CenterSuperintendentStudentReport.component';

describe('CenterSuperintendentStudentReportComponent', () => {
  let component: CenterSuperintendentStudentReportComponent;
  let fixture: ComponentFixture<CenterSuperintendentStudentReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CenterSuperintendentStudentReportComponent]
    });
    fixture = TestBed.createComponent(CenterSuperintendentStudentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
