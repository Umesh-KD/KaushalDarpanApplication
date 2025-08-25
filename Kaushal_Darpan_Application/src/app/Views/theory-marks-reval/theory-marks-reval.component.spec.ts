import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheoryMarksRevalComponent } from './theory-marks-reval.component';

describe('TheoryMarksRevalComponent', () => {
  let component: TheoryMarksRevalComponent;
  let fixture: ComponentFixture<TheoryMarksRevalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TheoryMarksRevalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TheoryMarksRevalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
