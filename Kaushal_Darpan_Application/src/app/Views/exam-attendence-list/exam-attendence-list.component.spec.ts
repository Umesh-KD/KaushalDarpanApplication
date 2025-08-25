import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamAttendenceListComponent } from './exam-attendence-list.component';

describe('ExamAttendenceListComponent', () => {
  let component: ExamAttendenceListComponent;
  let fixture: ComponentFixture<ExamAttendenceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExamAttendenceListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamAttendenceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
