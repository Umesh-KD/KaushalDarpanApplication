import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIsComponent } from './itis.component';

describe('ITIsComponent', () => {
  let component: ITIsComponent;
  let fixture: ComponentFixture<ITIsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ITIsComponent]
    });
    fixture = TestBed.createComponent(ITIsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
