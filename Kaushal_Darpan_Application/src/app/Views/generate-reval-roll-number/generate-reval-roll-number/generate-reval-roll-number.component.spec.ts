import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateRevalRollNumberComponent } from './generate-reval-roll-number.component';

describe('GenerateRevalRollNumberComponent', () => {
  let component: GenerateRevalRollNumberComponent;
  let fixture: ComponentFixture<GenerateRevalRollNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateRevalRollNumberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateRevalRollNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
