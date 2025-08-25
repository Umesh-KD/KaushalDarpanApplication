import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyMasterReportComponent } from './CompanyMasterReport.component';

describe('CompanyMasterReportComponent', () => {
  let component: CompanyMasterReportComponent;
  let fixture: ComponentFixture<CompanyMasterReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyMasterReportComponent]
    });
    fixture = TestBed.createComponent(CompanyMasterReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
