import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopProgressReportListComponent } from './workshop-progress-report-list.component';

describe('WorkshopProgressReportListComponent', () => {
  let component: WorkshopProgressReportListComponent;
  let fixture: ComponentFixture<WorkshopProgressReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkshopProgressReportListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkshopProgressReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
