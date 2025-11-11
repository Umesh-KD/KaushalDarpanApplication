import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSanctionOrderComponent } from './add-sanction-order.component';

describe('AddSanctionOrderComponent', () => {
  let component: AddSanctionOrderComponent;
  let fixture: ComponentFixture<AddSanctionOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddSanctionOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSanctionOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
