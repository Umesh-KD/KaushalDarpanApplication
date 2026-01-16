import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SR5ReportBTERComponent } from './sr5-report-bter.component';

describe('SR5ReportBTERComponent', () => {
  let component: SR5ReportBTERComponent;
  let fixture: ComponentFixture<SR5ReportBTERComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SR5ReportBTERComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SR5ReportBTERComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
