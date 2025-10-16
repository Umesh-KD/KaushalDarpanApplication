import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowRevealuationITIComponent } from './know-revealuation-iti.component';

describe('KnowRevealuationITIComponent', () => {
  let component: KnowRevealuationITIComponent;
  let fixture: ComponentFixture<KnowRevealuationITIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KnowRevealuationITIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KnowRevealuationITIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
