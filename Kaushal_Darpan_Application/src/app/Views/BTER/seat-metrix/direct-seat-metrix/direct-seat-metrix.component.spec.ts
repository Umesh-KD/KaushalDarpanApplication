import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BTERSeatMetrixListComponent } from './direct-seat-metrix.component';

describe('BTERSeatMetrixList', () => {
  let component: BTERSeatMetrixListComponent;
  let fixture: ComponentFixture<BTERSeatMetrixListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BTERSeatMetrixListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BTERSeatMetrixListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
