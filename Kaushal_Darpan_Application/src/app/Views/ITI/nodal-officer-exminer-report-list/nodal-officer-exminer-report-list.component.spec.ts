import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodalOfficerExminerReportListComponent } from './nodal-officer-exminer-report-list.component';

describe('ITIGovtEMZonalOfficeListComponent', () => {
  let component: NodalOfficerExminerReportListComponent;
  let fixture: ComponentFixture<NodalOfficerExminerReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NodalOfficerExminerReportListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodalOfficerExminerReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
