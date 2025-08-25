import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentEnrollmentCancelationComponent } from './student-enrollment-cancelation.component';

describe('StudentEnrollmentCancelationComponent', () => {
  let component: StudentEnrollmentCancelationComponent;
  let fixture: ComponentFixture<StudentEnrollmentCancelationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentEnrollmentCancelationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentEnrollmentCancelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
