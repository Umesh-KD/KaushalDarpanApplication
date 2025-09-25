import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentExamDetailsViewModalComponent } from './student-exam-details-view-modal.component';

describe('StudentExamDetailsViewModalComponent', () => {
  let component: StudentExamDetailsViewModalComponent;
  let fixture: ComponentFixture<StudentExamDetailsViewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentExamDetailsViewModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentExamDetailsViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
