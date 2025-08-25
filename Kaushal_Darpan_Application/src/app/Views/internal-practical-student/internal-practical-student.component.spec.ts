import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalPracticalStudentComponent } from './internal-practical-student.component';

describe('InternalPracticalStudentComponent', () => {
  let component: InternalPracticalStudentComponent;
  let fixture: ComponentFixture<InternalPracticalStudentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InternalPracticalStudentComponent]
    });
    fixture = TestBed.createComponent(InternalPracticalStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
