import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BterInternalSlidingComponent } from './bter-internal-sliding.component';

describe('BterInternalSlidingComponent', () => {
  let component: BterInternalSlidingComponent;
  let fixture: ComponentFixture<BterInternalSlidingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BterInternalSlidingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BterInternalSlidingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
