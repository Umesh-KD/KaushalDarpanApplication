import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BterMeritComponent } from './bter-merit.component';

describe('BterMeritComponent', () => {
  let component: BterMeritComponent;
  let fixture: ComponentFixture<BterMeritComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BterMeritComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BterMeritComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
