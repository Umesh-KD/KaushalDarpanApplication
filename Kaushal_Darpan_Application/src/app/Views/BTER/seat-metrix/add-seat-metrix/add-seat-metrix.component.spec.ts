import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSeatMetrixComponent } from './add-seat-metrix.component';

describe('AddSeatMetrixComponent', () => {
  let component: AddSeatMetrixComponent;
  let fixture: ComponentFixture<AddSeatMetrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSeatMetrixComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSeatMetrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
