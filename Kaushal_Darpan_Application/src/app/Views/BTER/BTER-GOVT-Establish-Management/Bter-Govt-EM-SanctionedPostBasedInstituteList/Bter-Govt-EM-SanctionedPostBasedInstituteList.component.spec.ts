import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BterGovtEMSanctionedPostBasedInstituteListComponent } from './Bter-Govt-EM-SanctionedPostBasedInstituteList.component';

describe('BterGovtEMSanctionedPostBasedInstituteListComponent', () => {
  let component: BterGovtEMSanctionedPostBasedInstituteListComponent;
  let fixture: ComponentFixture<BterGovtEMSanctionedPostBasedInstituteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BterGovtEMSanctionedPostBasedInstituteListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BterGovtEMSanctionedPostBasedInstituteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
