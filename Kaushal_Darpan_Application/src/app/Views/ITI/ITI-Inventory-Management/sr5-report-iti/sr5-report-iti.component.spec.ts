import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SR5ReportITIComponent } from './sr5-report-iti.component';

describe('SR5ReportITIComponent', () => {
  let component: SR5ReportITIComponent;
  let fixture: ComponentFixture<SR5ReportITIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SR5ReportITIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SR5ReportITIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
