import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperCountCustomizeReportComponent } from './Paper-Count-Customize-Report.component';

describe('PaperCountCustomizeReportComponent', () => {
  let component: PaperCountCustomizeReportComponent;
  let fixture: ComponentFixture<PaperCountCustomizeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaperCountCustomizeReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaperCountCustomizeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
