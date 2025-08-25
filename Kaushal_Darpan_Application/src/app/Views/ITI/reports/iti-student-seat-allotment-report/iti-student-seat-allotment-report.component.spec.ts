import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiStudentSeatAllotmentReportComponent } from './iti-student-seat-allotment-report.component';

describe('ItiStudentSeatAllotmentReportComponent', () => {
  let component: ItiStudentSeatAllotmentReportComponent;
  let fixture: ComponentFixture<ItiStudentSeatAllotmentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItiStudentSeatAllotmentReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiStudentSeatAllotmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
