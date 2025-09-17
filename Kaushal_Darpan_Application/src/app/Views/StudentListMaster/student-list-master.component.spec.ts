import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentListMasterComponent } from './student-list-master.component';

describe('CompanyMasterComponent', () => {
  let component: StudentListMasterComponent;
  let fixture: ComponentFixture<StudentListMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentListMasterComponent]
    });
    fixture = TestBed.createComponent(StudentListMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
