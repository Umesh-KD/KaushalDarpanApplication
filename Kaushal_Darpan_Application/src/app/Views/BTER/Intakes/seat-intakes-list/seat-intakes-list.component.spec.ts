import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatIntakesListComponent } from './seat-intakes-list.component';

describe('SeatIntakesListComponent', () => {
  let component: SeatIntakesListComponent;
  let fixture: ComponentFixture<SeatIntakesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeatIntakesListComponent]
    });
    fixture = TestBed.createComponent(SeatIntakesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
