import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterAllocationComponent } from './center-allocation.component';

describe('CenterAllocationComponent', () => {
  let component: CenterAllocationComponent;
  let fixture: ComponentFixture<CenterAllocationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CenterAllocationComponent]
    });
    fixture = TestBed.createComponent(CenterAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
