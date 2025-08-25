import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupcodeAllocationComponent } from './groupcode-allocation.component';

describe('GroupcodeAllocationComponent', () => {
  let component: GroupcodeAllocationComponent;
  let fixture: ComponentFixture<GroupcodeAllocationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupcodeAllocationComponent]
    });
    fixture = TestBed.createComponent(GroupcodeAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
