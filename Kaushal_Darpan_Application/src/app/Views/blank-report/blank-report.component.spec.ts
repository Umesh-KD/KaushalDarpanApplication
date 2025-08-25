import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlankReportComponent } from './blank-report.component';

describe('BlankReportComponent', () => {
  let component: BlankReportComponent;
  let fixture: ComponentFixture<BlankReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlankReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlankReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
