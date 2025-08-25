import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSeatWithdrawReportComponent } from './student-seat-withdraw-report.component';

describe('StudentSeatWithdrawReportComponent', () => {
  let component: StudentSeatWithdrawReportComponent;
  let fixture: ComponentFixture<StudentSeatWithdrawReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentSeatWithdrawReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentSeatWithdrawReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
