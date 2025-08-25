import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTimeTableComponent } from './AddTimeTableComponent';

describe('AddTimeTableComponent', () => {
  let component: AddTimeTableComponent;
  let fixture: ComponentFixture<AddTimeTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTimeTableComponent]
    });
    fixture = TestBed.createComponent(AddTimeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
