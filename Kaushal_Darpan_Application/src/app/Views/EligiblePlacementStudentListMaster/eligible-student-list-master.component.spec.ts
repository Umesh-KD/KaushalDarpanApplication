import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibleStudentListMasterComponent } from './eligible-student-list-master.component';

describe('CompanyMasterComponent', () => {
  let component:  EligibleStudentListMasterComponent;
  let fixture: ComponentFixture<EligibleStudentListMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EligibleStudentListMasterComponent]
    });
    fixture = TestBed.createComponent(EligibleStudentListMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
