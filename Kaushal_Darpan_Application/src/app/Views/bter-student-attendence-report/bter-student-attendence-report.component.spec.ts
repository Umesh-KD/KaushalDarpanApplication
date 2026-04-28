import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BterStudentAttendenceReportComponent } from './bter-student-attendence-report.component';

describe('BterStudentAttendenceReportComponent', () => {
  let component: BterStudentAttendenceReportComponent;
  let fixture: ComponentFixture<BterStudentAttendenceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BterStudentAttendenceReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BterStudentAttendenceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
