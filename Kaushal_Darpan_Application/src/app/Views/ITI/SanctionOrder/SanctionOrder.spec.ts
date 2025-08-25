import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanctionOrderComponent } from './SanctionOrder.component';

describe('addBoardUniversityComponent', () => {
  let component: SanctionOrderComponent;
  let fixture: ComponentFixture<SanctionOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SanctionOrderComponent]
    });
    fixture = TestBed.createComponent(SanctionOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
