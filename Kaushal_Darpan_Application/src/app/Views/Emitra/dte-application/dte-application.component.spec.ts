import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DTEApplicationComponent } from './dte-application.component';

describe('AllotStatusComponent', () => {
  let component: DTEApplicationComponent;
  let fixture: ComponentFixture<DTEApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DTEApplicationComponent]
    });
    fixture = TestBed.createComponent(DTEApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
