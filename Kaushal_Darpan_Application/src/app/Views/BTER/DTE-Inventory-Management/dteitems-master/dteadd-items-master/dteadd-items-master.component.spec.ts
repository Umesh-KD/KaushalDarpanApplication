import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemsMasterComponent } from './dteadd-items-master.component';

describe('AddItemsMasterComponent', () => {
  let component: AddItemsMasterComponent;
  let fixture: ComponentFixture<AddItemsMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddItemsMasterComponent]
    });
    fixture = TestBed.createComponent(AddItemsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
