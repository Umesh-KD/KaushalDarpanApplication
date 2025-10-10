import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatDataListComponent } from './seat-datalist.component';

describe('SeatDataListComponent', () => {
  let component: SeatDataListComponent;
  let fixture: ComponentFixture<SeatDataListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeatDataListComponent]
    });
    fixture = TestBed.createComponent(SeatDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
