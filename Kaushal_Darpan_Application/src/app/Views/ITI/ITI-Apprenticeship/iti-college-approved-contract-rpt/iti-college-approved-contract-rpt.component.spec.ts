import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiCollegeApprovedContractRPTComponent } from './iti-college-approved-contract-rpt.component';

describe('ItiCollegeApprovedContractRPTComponent', () => {
  let component: ItiCollegeApprovedContractRPTComponent;
  let fixture: ComponentFixture<ItiCollegeApprovedContractRPTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItiCollegeApprovedContractRPTComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiCollegeApprovedContractRPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
