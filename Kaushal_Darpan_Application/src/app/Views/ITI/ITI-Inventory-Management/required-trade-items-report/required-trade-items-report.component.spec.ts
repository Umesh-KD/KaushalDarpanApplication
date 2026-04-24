import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequiredTradeItemsReportComponent } from './required-trade-items-report.component';

describe('RequiredTradeItemsReportComponent', () => {
  let component: RequiredTradeItemsReportComponent;
  let fixture: ComponentFixture<RequiredTradeItemsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequiredTradeItemsReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequiredTradeItemsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
