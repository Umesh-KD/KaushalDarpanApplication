import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BTERApplicationComponent } from './bter-application.component';

describe('BTERApplicationComponent', () => {
  let component: BTERApplicationComponent;
  let fixture: ComponentFixture<BTERApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BTERApplicationComponent]
    });
    fixture = TestBed.createComponent(BTERApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
