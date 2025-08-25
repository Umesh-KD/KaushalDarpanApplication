import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlockExamAttendanceComponent } from './unlock-exam-attendance.component';

describe('UnlockExamAttendanceComponent', () => {
  let component: UnlockExamAttendanceComponent;
  let fixture: ComponentFixture<UnlockExamAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnlockExamAttendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnlockExamAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
