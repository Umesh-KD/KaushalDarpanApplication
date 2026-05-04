import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiTeacherAttendanceComponent } from './iti-teacher-attendance.component';

describe('ItiTeacherAttendanceComponent', () => {
  let component: ItiTeacherAttendanceComponent;
  let fixture: ComponentFixture<ItiTeacherAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItiTeacherAttendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiTeacherAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
