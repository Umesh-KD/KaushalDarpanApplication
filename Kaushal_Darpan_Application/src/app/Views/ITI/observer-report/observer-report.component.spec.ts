import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObserverReportComponent } from './observer-report.component';

describe('ObserverReportComponent', () => {
  let component: ObserverReportComponent;
  let fixture: ComponentFixture<ObserverReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObserverReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObserverReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
