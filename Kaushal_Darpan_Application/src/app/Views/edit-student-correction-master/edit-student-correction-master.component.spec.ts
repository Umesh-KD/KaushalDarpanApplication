import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStudentCorrectionMasterComponent } from './edit-student-correction-master.component';

describe('AddCompanyMasterComponent', () => {
  let component: EditStudentCorrectionMasterComponent;
  let fixture: ComponentFixture<EditStudentCorrectionMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditStudentCorrectionMasterComponent]
    });
    fixture = TestBed.createComponent(EditStudentCorrectionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
