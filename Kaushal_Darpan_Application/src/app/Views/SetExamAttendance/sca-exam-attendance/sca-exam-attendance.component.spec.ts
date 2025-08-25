import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SCAExamAttendanceComponent } from './sca-exam-attendance.component';

describe('SCAExamAttendanceComponent', () => {
  let component: SCAExamAttendanceComponent;
  let fixture: ComponentFixture<SCAExamAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SCAExamAttendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SCAExamAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
