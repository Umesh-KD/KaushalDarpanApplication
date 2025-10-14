import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevealuationComponent } from './revealuation.component';

describe('RevealuationComponent', () => {
  let component: RevealuationComponent;
  let fixture: ComponentFixture<RevealuationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RevealuationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevealuationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
