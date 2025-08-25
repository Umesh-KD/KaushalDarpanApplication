import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterTradeStudentReportComponent } from './center-trade-student-report.component';

describe('CenterTradeStudentReportComponent', () => {
  let component: CenterTradeStudentReportComponent;
  let fixture: ComponentFixture<CenterTradeStudentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CenterTradeStudentReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CenterTradeStudentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
