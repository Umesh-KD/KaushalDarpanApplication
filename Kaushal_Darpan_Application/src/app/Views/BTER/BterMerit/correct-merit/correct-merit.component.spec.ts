import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectMeritComponent } from './correct-merit.component';

describe('CorrectMeritComponent', () => {
  let component: CorrectMeritComponent;
  let fixture: ComponentFixture<CorrectMeritComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CorrectMeritComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorrectMeritComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
