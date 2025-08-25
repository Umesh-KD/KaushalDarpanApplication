import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIGovtEMSanctionedPostBasedInstituteListComponent } from './ITI-Govt-EM-SanctionedPostBasedInstituteList.component';

describe('ITIGovtEMSanctionedPostBasedInstituteListComponent', () => {
  let component: ITIGovtEMSanctionedPostBasedInstituteListComponent;
  let fixture: ComponentFixture<ITIGovtEMSanctionedPostBasedInstituteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIGovtEMSanctionedPostBasedInstituteListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIGovtEMSanctionedPostBasedInstituteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
