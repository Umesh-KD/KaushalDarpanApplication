import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateRollnumberITIComponent } from './generate-rollnumber-iti.component';

describe('GenerateRollnumberITIComponent', () => {
  let component: GenerateRollnumberITIComponent;
  let fixture: ComponentFixture<GenerateRollnumberITIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenerateRollnumberITIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateRollnumberITIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
