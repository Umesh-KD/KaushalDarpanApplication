import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheoryMarksItiComponent } from './theory-marks-iti.component';

describe('TheoryMarksItiComponent', () => {
  let component: TheoryMarksItiComponent;
  let fixture: ComponentFixture<TheoryMarksItiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TheoryMarksItiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TheoryMarksItiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
