import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiStudentEnrollmentReportsComponent } from './iti-student-enrollment-reports.component';

describe('ItiStudentEnrollmentReportsComponent', () => {
  let component: ItiStudentEnrollmentReportsComponent;
  let fixture: ComponentFixture<ItiStudentEnrollmentReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItiStudentEnrollmentReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiStudentEnrollmentReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
