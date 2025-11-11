import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanctionOrderListComponent } from './sanction-order-list.component';

describe('SanctionOrderListComponent', () => {
  let component: SanctionOrderListComponent;
  let fixture: ComponentFixture<SanctionOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SanctionOrderListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SanctionOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
