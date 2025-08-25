import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveValidationComponent } from './leave-validation.component';

describe('LeaveValidationComponent', () => {
  let component: LeaveValidationComponent;
  let fixture: ComponentFixture<LeaveValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeaveValidationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
