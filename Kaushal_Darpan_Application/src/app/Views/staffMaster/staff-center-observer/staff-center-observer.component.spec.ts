import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffCenterObserverComponent } from './staff-center-observer.component';

describe('StaffCenterObserverComponent', () => {
  let component: StaffCenterObserverComponent;
  let fixture: ComponentFixture<StaffCenterObserverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffCenterObserverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffCenterObserverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
