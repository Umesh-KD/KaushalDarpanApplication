import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SR6ReportBTERComponent } from './sr6-report-bter.component';

describe('SR6ReportBTERComponent', () => {
  let component: SR6ReportBTERComponent;
  let fixture: ComponentFixture<SR6ReportBTERComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SR6ReportBTERComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SR6ReportBTERComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
