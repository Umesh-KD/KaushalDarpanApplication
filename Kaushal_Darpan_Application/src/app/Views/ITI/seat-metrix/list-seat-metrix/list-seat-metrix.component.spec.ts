import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSeatMetrixComponent } from './list-seat-metrix.component';

describe('ListSeatMetrixComponent', () => {
  let component: ListSeatMetrixComponent;
  let fixture: ComponentFixture<ListSeatMetrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListSeatMetrixComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSeatMetrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
