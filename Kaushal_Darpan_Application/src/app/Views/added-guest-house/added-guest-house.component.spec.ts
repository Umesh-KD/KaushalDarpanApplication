import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddedGuestHouseComponent } from './added-guest-house.component';

describe('AddedGuestHouseComponent', () => {
  let component: AddedGuestHouseComponent;
  let fixture: ComponentFixture<AddedGuestHouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddedGuestHouseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddedGuestHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
