import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowMeritComponent } from './know-merit.component';

describe('KnowMeritComponent', () => {
  let component: KnowMeritComponent;
  let fixture: ComponentFixture<KnowMeritComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KnowMeritComponent]
    });
    fixture = TestBed.createComponent(KnowMeritComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
