import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IIPCollageReportComponent } from './iipcollage-report.component';

describe('IIPCollageReportComponent', () => {
  let component: IIPCollageReportComponent;
  let fixture: ComponentFixture<IIPCollageReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IIPCollageReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IIPCollageReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
