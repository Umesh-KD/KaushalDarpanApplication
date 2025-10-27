import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevalStudentUpdateDetailsComponent } from './reval-student_updatedetails.component';

describe('CompanyMasterComponent', () => {
  let component: RevalStudentUpdateDetailsComponent;
  let fixture: ComponentFixture<RevalStudentUpdateDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevalStudentUpdateDetailsComponent]
    });
    fixture = TestBed.createComponent(RevalStudentUpdateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
