import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksItemsListComponent } from './dtestocks-items-list.component';

describe('StocksItemsListComponent', () => {
  let component: StocksItemsListComponent;
  let fixture: ComponentFixture<StocksItemsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StocksItemsListComponent]
    });
    fixture = TestBed.createComponent(StocksItemsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
