import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateMeritComponent } from './generate-merit.component';

describe('GenerateMeritComponent', () => {
  let component: GenerateMeritComponent;
  let fixture: ComponentFixture<GenerateMeritComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateMeritComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateMeritComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
