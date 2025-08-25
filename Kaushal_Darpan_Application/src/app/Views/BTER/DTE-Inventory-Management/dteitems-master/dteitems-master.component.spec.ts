import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsMasterComponent } from './dteitems-master.component';

describe('ItemsMasterComponent', () => {
  let component: ItemsMasterComponent;
  let fixture: ComponentFixture<ItemsMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemsMasterComponent]
    });
    fixture = TestBed.createComponent(ItemsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
