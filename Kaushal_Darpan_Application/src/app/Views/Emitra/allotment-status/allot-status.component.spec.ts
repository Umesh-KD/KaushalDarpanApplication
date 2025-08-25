import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotStatusComponent } from './allot-status.component';

describe('AllotStatusComponent', () => {
  let component: AllotStatusComponent;
  let fixture: ComponentFixture<AllotStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllotStatusComponent]
    });
    fixture = TestBed.createComponent(AllotStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
