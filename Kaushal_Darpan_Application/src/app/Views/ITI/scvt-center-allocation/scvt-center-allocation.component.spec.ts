import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScvtCenterAllocationComponent } from './scvt-center-allocation.component';

describe('ScvtCenterAllocationComponent', () => {
  let component: ScvtCenterAllocationComponent;
  let fixture: ComponentFixture<ScvtCenterAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScvtCenterAllocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScvtCenterAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
