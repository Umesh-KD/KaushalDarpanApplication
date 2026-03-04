import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlockCalenderComponent } from './unlock-calender.component';

describe('UnlockCalenderComponent', () => {
  let component: UnlockCalenderComponent;
  let fixture: ComponentFixture<UnlockCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnlockCalenderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnlockCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
