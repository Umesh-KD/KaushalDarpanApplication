import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyRollNumberComponent } from './verify-roll-number.component';

describe('VerifyRollNumberComponent', () => {
  let component: VerifyRollNumberComponent;
  let fixture: ComponentFixture<VerifyRollNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifyRollNumberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyRollNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
