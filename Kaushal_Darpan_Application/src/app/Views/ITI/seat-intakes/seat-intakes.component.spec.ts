import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatIntakesComponent } from './seat-intakes.component';

describe('SeatIntakesComponent', () => {
  let component: SeatIntakesComponent;
  let fixture: ComponentFixture<SeatIntakesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeatIntakesComponent]
    });
    fixture = TestBed.createComponent(SeatIntakesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
