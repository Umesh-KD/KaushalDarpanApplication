import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSeatsDistributionsComponent } from './add-seats-distributions.component';

describe('AddSeatsDistributionsComponent', () => {
  let component: AddSeatsDistributionsComponent;
  let fixture: ComponentFixture<AddSeatsDistributionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSeatsDistributionsComponent]
    });
    fixture = TestBed.createComponent(AddSeatsDistributionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
