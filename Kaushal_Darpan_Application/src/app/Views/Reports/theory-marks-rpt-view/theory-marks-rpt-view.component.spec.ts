import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheoryMarksRptViewComponent } from './theory-marks-rpt-view.component';

describe('TheoryMarksRptViewComponent', () => {
  let component: TheoryMarksRptViewComponent;
  let fixture: ComponentFixture<TheoryMarksRptViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TheoryMarksRptViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TheoryMarksRptViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
