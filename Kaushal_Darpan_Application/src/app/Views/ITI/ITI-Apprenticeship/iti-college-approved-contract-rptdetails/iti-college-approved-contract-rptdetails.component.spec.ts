import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiCollegeApprovedContractRptdetailsComponent } from './iti-college-approved-contract-rptdetails.component';

describe('ItiCollegeApprovedContractRptdetailsComponent', () => {
  let component: ItiCollegeApprovedContractRptdetailsComponent;
  let fixture: ComponentFixture<ItiCollegeApprovedContractRptdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItiCollegeApprovedContractRptdetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiCollegeApprovedContractRptdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
