import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawAllotmentComponent } from './withdraw-allotment.component';

describe('WithdrawAllotmentComponent', () => {
  let component: WithdrawAllotmentComponent;
  let fixture: ComponentFixture<WithdrawAllotmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithdrawAllotmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithdrawAllotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
