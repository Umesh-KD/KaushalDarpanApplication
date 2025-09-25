import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegenerateHostelMeritComponent } from './regenerate-hostel-merit.component';

describe('RegenerateHostelMeritComponent', () => {
  let component: RegenerateHostelMeritComponent;
  let fixture: ComponentFixture<RegenerateHostelMeritComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegenerateHostelMeritComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegenerateHostelMeritComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
