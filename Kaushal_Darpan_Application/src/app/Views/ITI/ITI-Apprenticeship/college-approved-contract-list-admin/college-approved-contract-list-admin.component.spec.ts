import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeApprovedContractListAdminComponent } from './college-approved-contract-list-admin.component';

describe('CollegeApprovedContractListAdminComponent', () => {
  let component: CollegeApprovedContractListAdminComponent;
  let fixture: ComponentFixture<CollegeApprovedContractListAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollegeApprovedContractListAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollegeApprovedContractListAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
