import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReAssignTeacherForAttendanceComponent } from './ReAssignTeacherForAttendance.component';

describe('RosteComponent', () => {
  let component: ReAssignTeacherForAttendanceComponent;
  let fixture: ComponentFixture<ReAssignTeacherForAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReAssignTeacherForAttendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReAssignTeacherForAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
