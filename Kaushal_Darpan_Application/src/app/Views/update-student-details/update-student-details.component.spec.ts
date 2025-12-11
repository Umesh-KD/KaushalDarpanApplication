import { ComponentFixture, TestBed } from '@angular/core/testing';

import {UpdateStudentDetailComponent } from './update-student-details.component';

describe('CompanyMasterComponent', () => {
  let component:  UpdateStudentDetailComponent;
  let fixture: ComponentFixture<UpdateStudentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateStudentDetailComponent]
    });
    fixture = TestBed.createComponent(UpdateStudentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
