import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDetailUpdateComponent } from './student-detail-update.component';

describe('StudentDetailUpdateComponent', () => {
  let component: StudentDetailUpdateComponent;
  let fixture: ComponentFixture<StudentDetailUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentDetailUpdateComponent]
    });
    fixture = TestBed.createComponent(StudentDetailUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
