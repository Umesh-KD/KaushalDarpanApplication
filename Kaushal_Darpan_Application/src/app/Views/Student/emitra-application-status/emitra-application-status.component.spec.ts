import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmitraApplicationStatusComponent } from './emitra-application-status.component';

describe('EmitraApplicationStatusComponent', () => {
  let component: EmitraApplicationStatusComponent;
  let fixture: ComponentFixture<EmitraApplicationStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmitraApplicationStatusComponent]
    });
    fixture = TestBed.createComponent(EmitraApplicationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
