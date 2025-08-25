import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditStudentJanaadharComponent } from './add-edit-student-janaadhar.component';

describe('AddEditStudentJanaadharComponent', () => {
  let component: AddEditStudentJanaadharComponent;
  let fixture: ComponentFixture<AddEditStudentJanaadharComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditStudentJanaadharComponent]
    });
    fixture = TestBed.createComponent(AddEditStudentJanaadharComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
