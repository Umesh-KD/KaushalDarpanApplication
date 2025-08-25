import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonElectiveFormFillingReportComponent } from './non-elective-form-filling-report.component';

describe('NonElectiveFormFillingReportComponent', () => {
  let component: NonElectiveFormFillingReportComponent;
  let fixture: ComponentFixture<NonElectiveFormFillingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonElectiveFormFillingReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonElectiveFormFillingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
