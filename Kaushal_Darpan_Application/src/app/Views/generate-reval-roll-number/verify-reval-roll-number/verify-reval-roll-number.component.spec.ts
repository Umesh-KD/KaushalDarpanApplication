import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyRevalRollNumberComponent } from './verify-reval-roll-number.component';

describe('VerifyRevalRollNumberComponent', () => {
  let component: VerifyRevalRollNumberComponent;
  let fixture: ComponentFixture<VerifyRevalRollNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyRevalRollNumberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyRevalRollNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
