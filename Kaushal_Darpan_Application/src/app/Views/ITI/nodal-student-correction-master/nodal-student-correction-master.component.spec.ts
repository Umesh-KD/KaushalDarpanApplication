import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodalStudentCorrectionMasterComponent } from './nodal-student-correction-master.component';

describe('NodalStudentCorrectionMasterComponent', () => {
  let component: NodalStudentCorrectionMasterComponent;
  let fixture: ComponentFixture<NodalStudentCorrectionMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NodalStudentCorrectionMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodalStudentCorrectionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
