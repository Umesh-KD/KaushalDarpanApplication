import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiRptStatisticsComponent } from './iti-rpt-statistics.component';

describe('ItiRptStatisticsComponent', () => {
  let component: ItiRptStatisticsComponent;
  let fixture: ComponentFixture<ItiRptStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItiRptStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiRptStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
