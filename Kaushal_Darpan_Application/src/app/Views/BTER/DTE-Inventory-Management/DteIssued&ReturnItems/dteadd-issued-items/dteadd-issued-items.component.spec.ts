import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIssuedItemsComponent } from './dteadd-issued-items.component';

describe('AddIssuedItemsComponent', () => {
  let component: AddIssuedItemsComponent;
  let fixture: ComponentFixture<AddIssuedItemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddIssuedItemsComponent]
    });
    fixture = TestBed.createComponent(AddIssuedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
