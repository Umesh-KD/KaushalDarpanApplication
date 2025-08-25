import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ITIAllotmentReportComponent } from './iti-allotment-report.component';

describe('IMCAllotmentReportComponent', () => {
  let component: ITIAllotmentReportComponent;
  let fixture: ComponentFixture<ITIAllotmentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIAllotmentReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIAllotmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
