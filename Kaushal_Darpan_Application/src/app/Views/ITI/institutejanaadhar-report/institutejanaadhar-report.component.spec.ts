import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutejanaadharReportComponent } from './institutejanaadhar-report.component';

describe('InstitutejanaadharReportComponent', () => {
  let component: InstitutejanaadharReportComponent;
  let fixture: ComponentFixture<InstitutejanaadharReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstitutejanaadharReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstitutejanaadharReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
