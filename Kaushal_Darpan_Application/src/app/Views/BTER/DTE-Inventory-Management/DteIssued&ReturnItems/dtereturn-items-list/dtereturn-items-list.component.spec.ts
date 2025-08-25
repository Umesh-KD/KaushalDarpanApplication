import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnItemsListComponent } from './dtereturn-items-list.component';

describe('ReturnItemsListComponent', () => {
  let component: ReturnItemsListComponent;
  let fixture: ComponentFixture<ReturnItemsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReturnItemsListComponent]
    });
    fixture = TestBed.createComponent(ReturnItemsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
