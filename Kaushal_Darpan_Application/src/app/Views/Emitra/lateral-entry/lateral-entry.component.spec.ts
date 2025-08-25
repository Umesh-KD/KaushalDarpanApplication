import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LateralEntryComponent } from './lateral-entry.component';

describe('LateralEntryComponent', () => {
  let component: LateralEntryComponent;
  let fixture: ComponentFixture<LateralEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LateralEntryComponent]
    });
    fixture = TestBed.createComponent(LateralEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
