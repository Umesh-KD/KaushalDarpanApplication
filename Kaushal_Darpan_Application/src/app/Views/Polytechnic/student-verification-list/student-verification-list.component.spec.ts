import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentVerificationListComponent } from './student-verification-list.component';

describe('StudentVerificationListComponent', () => {
  let component: StudentVerificationListComponent;
  let fixture: ComponentFixture<StudentVerificationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentVerificationListComponent]
    });
    fixture = TestBed.createComponent(StudentVerificationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
