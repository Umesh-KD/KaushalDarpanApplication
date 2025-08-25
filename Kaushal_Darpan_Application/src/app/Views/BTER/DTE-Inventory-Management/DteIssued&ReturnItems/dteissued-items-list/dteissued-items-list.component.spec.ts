import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuedItemsListComponent } from './dteissued-items-list.component';

describe('IssuedItemsListComponent', () => {
  let component: IssuedItemsListComponent;
  let fixture: ComponentFixture<IssuedItemsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IssuedItemsListComponent]
    });
    fixture = TestBed.createComponent(IssuedItemsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
