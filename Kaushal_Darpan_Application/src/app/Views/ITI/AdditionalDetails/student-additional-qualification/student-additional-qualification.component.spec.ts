import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAdditionalQualiComponent } from './student-additional-qualification.component';

describe('StudentAdditionalQualiComponent', () => {
  let component: StudentAdditionalQualiComponent;
  let fixture: ComponentFixture<StudentAdditionalQualiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentAdditionalQualiComponent]
    });
    fixture = TestBed.createComponent(StudentAdditionalQualiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
