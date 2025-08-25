import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheoryMarksComponent } from './theory-marks.component';

describe('TheoryMarksComponent', () => {
  let component: TheoryMarksComponent;
  let fixture: ComponentFixture<TheoryMarksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TheoryMarksComponent]
    });
    fixture = TestBed.createComponent(TheoryMarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
