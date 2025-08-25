import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalPracticalExamAttendanceComponent } from './internal-practical-exam-attendance.component';

describe('InternalPracticalExamAttendanceComponent', () => {
  let component: InternalPracticalExamAttendanceComponent;
  let fixture: ComponentFixture<InternalPracticalExamAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternalPracticalExamAttendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternalPracticalExamAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
