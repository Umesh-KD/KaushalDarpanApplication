import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassoutRegistrationReportListComponent } from './passout-registration-report-list.component';

describe('PassoutRegistrationReportListComponent', () => {
  let component: PassoutRegistrationReportListComponent;
  let fixture: ComponentFixture<PassoutRegistrationReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PassoutRegistrationReportListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassoutRegistrationReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
