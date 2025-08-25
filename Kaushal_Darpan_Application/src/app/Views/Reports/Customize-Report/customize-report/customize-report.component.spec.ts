import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeReportComponent } from './customize-report.component';

describe('CustomizeReportComponent', () => {
  let component: CustomizeReportComponent;
  let fixture: ComponentFixture<CustomizeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomizeReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomizeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
