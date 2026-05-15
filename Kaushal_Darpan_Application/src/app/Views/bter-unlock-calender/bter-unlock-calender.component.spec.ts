import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BterUnlockCalenderComponent } from './bter-unlock-calender.component';

describe('BterUnlockCalenderComponent', () => {
  let component: BterUnlockCalenderComponent;
  let fixture: ComponentFixture<BterUnlockCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BterUnlockCalenderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BterUnlockCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
