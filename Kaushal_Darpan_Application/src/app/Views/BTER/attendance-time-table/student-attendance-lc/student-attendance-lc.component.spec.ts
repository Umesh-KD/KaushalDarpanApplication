import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAttendanceLComponent } from './student-attendance-lc.component';

describe('StudentAttendanceLComponent', () => {
  let component: StudentAttendanceLComponent;
  let fixture: ComponentFixture<StudentAttendanceLComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentAttendanceLComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentAttendanceLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
