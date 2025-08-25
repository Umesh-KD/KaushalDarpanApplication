import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIFlyingSquadReportComponent } from './iti-flying-squad-report.component';

describe('ITIInspectionReportComponent', () => {
  let component: ITIFlyingSquadReportComponent;
  let fixture: ComponentFixture<ITIFlyingSquadReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITIFlyingSquadReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIFlyingSquadReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
