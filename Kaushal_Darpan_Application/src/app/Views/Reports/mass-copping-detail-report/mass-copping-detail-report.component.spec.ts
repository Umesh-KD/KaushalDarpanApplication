import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MassCoppingDetailReportComponent } from './mass-copping-detail-report.component';

describe('StaticsReportProvideByExaminerComponent', () => {
  let component: MassCoppingDetailReportComponent;
  let fixture: ComponentFixture<MassCoppingDetailReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MassCoppingDetailReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MassCoppingDetailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
