import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatIntakesListAdmissionComponent } from './seat-intakes-list-admision.component';

describe('SeatIntakesListAdmissionComponent', () => {
  let component: SeatIntakesListAdmissionComponent;
  let fixture: ComponentFixture<SeatIntakesListAdmissionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeatIntakesListAdmissionComponent]
    });
    fixture = TestBed.createComponent(SeatIntakesListAdmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
