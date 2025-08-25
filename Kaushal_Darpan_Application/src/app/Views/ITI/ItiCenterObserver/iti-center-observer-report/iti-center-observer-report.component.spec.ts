import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITICenterObserverReportComponent } from './iti-center-observer-report.component';

describe('ITIInspectionReportComponent', () => {
  let component: ITICenterObserverReportComponent;
  let fixture: ComponentFixture<ITICenterObserverReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITICenterObserverReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITICenterObserverReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
