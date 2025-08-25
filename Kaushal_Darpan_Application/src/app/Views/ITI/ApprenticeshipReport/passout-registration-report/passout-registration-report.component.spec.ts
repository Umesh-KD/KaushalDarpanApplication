import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassoutRegistrationReportComponent } from './passout-registration-report.component';

describe('PassoutRegistrationReportComponent', () => {
  let component: PassoutRegistrationReportComponent;
  let fixture: ComponentFixture<PassoutRegistrationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PassoutRegistrationReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassoutRegistrationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
