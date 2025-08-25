import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuaterWorkshopReportComponent } from './quater-workshop-report.component';

describe('QuaterWorkshopReportComponent', () => {
  let component: QuaterWorkshopReportComponent;
  let fixture: ComponentFixture<QuaterWorkshopReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuaterWorkshopReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuaterWorkshopReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
