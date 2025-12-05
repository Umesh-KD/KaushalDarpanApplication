import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStudentEmployementComponent } from './add-self-employement.component';

describe('AddStudentEmployementComponent', () => {
  let component: AddStudentEmployementComponent;
  let fixture: ComponentFixture<AddStudentEmployementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddStudentEmployementComponent]
    });
    fixture = TestBed.createComponent(AddStudentEmployementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
