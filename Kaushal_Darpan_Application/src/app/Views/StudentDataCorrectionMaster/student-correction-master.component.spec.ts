import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCorrectionMasterComponent } from './student-correction-master.component';

describe('CompanyMasterComponent', () => {
  let component:  StudentCorrectionMasterComponent;
  let fixture: ComponentFixture<StudentCorrectionMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentCorrectionMasterComponent]
    });
    fixture = TestBed.createComponent(StudentCorrectionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
