import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIFinalReportComponent } from './ITI-FinalReport.component';

describe('VerifyItiCenterObserverDeploymentComponent', () => {
  let component: ITIFinalReportComponent;
  let fixture: ComponentFixture<ITIFinalReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITIFinalReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIFinalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
