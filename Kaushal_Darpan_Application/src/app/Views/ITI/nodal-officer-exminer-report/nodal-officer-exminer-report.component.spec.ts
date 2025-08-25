import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodalOfficerExminerReportComponent } from './nodal-officer-exminer-report.component';

describe('NodalOfficerExminerReportComponent', () => {
  let component: NodalOfficerExminerReportComponent;
  let fixture: ComponentFixture<NodalOfficerExminerReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NodalOfficerExminerReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodalOfficerExminerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
