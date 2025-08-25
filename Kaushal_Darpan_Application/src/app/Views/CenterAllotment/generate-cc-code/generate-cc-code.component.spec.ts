import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateCcCodeComponent } from './generate-cc-code.component';

describe('GenerateCcCodeComponent', () => {
  let component: GenerateCcCodeComponent;
  let fixture: ComponentFixture<GenerateCcCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateCcCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateCcCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
