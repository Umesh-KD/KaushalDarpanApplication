import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatIntakePlanningComponent } from './seat-intake-planning.component';

describe('SeatIntakePlanningComponent', () => {
  let component: SeatIntakePlanningComponent;
  let fixture: ComponentFixture<SeatIntakePlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeatIntakePlanningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeatIntakePlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
