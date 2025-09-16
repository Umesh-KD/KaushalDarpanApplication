import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabulationReportComponent } from './tabulation-report.component';

describe('TabulationReportComponent', () => {
  let component: TabulationReportComponent;
  let fixture: ComponentFixture<TabulationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabulationReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabulationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
