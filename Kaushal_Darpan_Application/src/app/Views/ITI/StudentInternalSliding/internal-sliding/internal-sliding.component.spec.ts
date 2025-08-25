import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalSlidingComponent } from './InternalSlidingComponent';

describe('InternalSlidingComponent', () => {
  let component: InternalSlidingComponent;
  let fixture: ComponentFixture<InternalSlidingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InternalSlidingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternalSlidingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
