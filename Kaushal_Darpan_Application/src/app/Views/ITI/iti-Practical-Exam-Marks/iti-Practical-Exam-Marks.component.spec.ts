import { ComponentFixture, TestBed } from '@angular/core/testing';

import { itiPracticalExamMarksComponent } from './iti-Practical-Exam-Marks.component';

describe('itiPracticalExamMarksComponent', () => {
  let component: itiPracticalExamMarksComponent;
  let fixture: ComponentFixture<itiPracticalExamMarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [itiPracticalExamMarksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(itiPracticalExamMarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
