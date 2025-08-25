import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolytechnicReportComponent } from './polytechnic-report.component';

describe('PolytechnicReportComponent', () => {
  let component: PolytechnicReportComponent;
  let fixture: ComponentFixture<PolytechnicReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PolytechnicReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolytechnicReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
