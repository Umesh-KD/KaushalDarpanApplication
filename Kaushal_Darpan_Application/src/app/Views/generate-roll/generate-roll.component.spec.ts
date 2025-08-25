import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateRollComponent } from './generate-roll.component';

describe('GenerateRollComponent', () => {
  let component: GenerateRollComponent;
  let fixture: ComponentFixture<GenerateRollComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateRollComponent]
    });
    fixture = TestBed.createComponent(GenerateRollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
