import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterAndSubjectWiseReportComponent } from './Center-And-Subject-Wise-Report.component';

describe('PaperCountCustomizeReportComponent', () => {
  let component: CenterAndSubjectWiseReportComponent;
  let fixture: ComponentFixture<CenterAndSubjectWiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CenterAndSubjectWiseReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CenterAndSubjectWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
