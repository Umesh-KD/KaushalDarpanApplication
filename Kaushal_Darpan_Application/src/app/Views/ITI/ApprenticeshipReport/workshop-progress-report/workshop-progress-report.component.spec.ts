import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopProgressReportComponent } from './workshop-progress-report.component';

describe('WorkshopProgressReportComponent', () => {
  let component: WorkshopProgressReportComponent;
  let fixture: ComponentFixture<WorkshopProgressReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkshopProgressReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkshopProgressReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
