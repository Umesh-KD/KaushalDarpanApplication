import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSeatIntakesComponent } from './add-seat-intakes.component';

describe('AddSeatIntakesComponent', () => {
  let component: AddSeatIntakesComponent;
  let fixture: ComponentFixture<AddSeatIntakesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSeatIntakesComponent]
    });
    fixture = TestBed.createComponent(AddSeatIntakesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
