import { ComponentFixture, TestBed } from '@angular/core/testing';

import { fresherRegistrationReportComponent } from './fresher-registration-report.component';

describe('fresherRegistrationReportComponent', () => {
  let component: fresherRegistrationReportComponent;
  let fixture: ComponentFixture<fresherRegistrationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [fresherRegistrationReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(fresherRegistrationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
