import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITICollegeWiseScholarshipComponent } from './iticollege-wise-scholarship.component';

describe('CompanyMasterComponent', () => {
  let component: ITICollegeWiseScholarshipComponent;
  let fixture: ComponentFixture<ITICollegeWiseScholarshipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ITICollegeWiseScholarshipComponent]
    });
    fixture = TestBed.createComponent(ITICollegeWiseScholarshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
