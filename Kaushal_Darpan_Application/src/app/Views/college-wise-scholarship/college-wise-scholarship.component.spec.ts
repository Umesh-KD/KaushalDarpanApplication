import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeWiseScholarshipComponent } from './college-wise-scholarship.component';

describe('CompanyMasterComponent', () => {
  let component: CollegeWiseScholarshipComponent;
  let fixture: ComponentFixture<CollegeWiseScholarshipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollegeWiseScholarshipComponent]
    });
    fixture = TestBed.createComponent(CollegeWiseScholarshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
