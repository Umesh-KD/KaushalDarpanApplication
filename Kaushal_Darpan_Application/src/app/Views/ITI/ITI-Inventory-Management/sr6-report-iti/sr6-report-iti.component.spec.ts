import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SR6ReportITIComponent } from './sr6-report-iti.component';

describe('SR6ReportITIComponent', () => {
  let component: SR6ReportITIComponent;
  let fixture: ComponentFixture<SR6ReportITIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SR6ReportITIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SR6ReportITIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
