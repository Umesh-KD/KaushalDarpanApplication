import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIIIPAdminReportComponent } from './iip-admin-report.component';

describe('ITIIIPAdminReportComponent', () => {
  let component: ITIIIPAdminReportComponent;
  let fixture: ComponentFixture<ITIIIPAdminReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITIIIPAdminReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIIIPAdminReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
