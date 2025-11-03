import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodalCollegeApprovedContractComponent } from './nodal-college-approved-contract.component';

describe('NodalCollegeApprovedContractComponent', () => {
  let component: NodalCollegeApprovedContractComponent;
  let fixture: ComponentFixture<NodalCollegeApprovedContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodalCollegeApprovedContractComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodalCollegeApprovedContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
