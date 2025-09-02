import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetCalendarComponent } from './SetCalendar.component';

describe('AddSeatIntakesComponent', () => {
  let component: SetCalendarComponent;
  let fixture: ComponentFixture<SetCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SetCalendarComponent]
    });
    fixture = TestBed.createComponent(SetCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
