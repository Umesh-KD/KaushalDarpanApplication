import { ComponentFixture, TestBed } from '@angular/core/testing';

import { fresherRegistrationReportListComponent } from './fresher-registration-report-list.component';

describe('fresherRegistrationReportListComponent', () => {
  let component: fresherRegistrationReportListComponent;
  let fixture: ComponentFixture<fresherRegistrationReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [fresherRegistrationReportListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(fresherRegistrationReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
