import { ComponentFixture, TestBed } from '@angular/core/testing';

import { bterRevalReportComponent } from './bter-Reval-Report.component';  ///

describe('bter-Reval-ReportComponent', () => {
  let component: bterRevalReportComponent;
  let fixture: ComponentFixture<bterRevalReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [bterRevalReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(bterRevalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
