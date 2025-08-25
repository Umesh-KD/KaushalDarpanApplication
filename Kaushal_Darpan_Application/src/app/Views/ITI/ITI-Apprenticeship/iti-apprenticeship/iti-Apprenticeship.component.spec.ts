import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIApprenticeshipComponent } from './iti-Apprenticeship.component';

describe('ITIInspectionComponent', () => {
  let component: ITIApprenticeshipComponent;
  let fixture: ComponentFixture<ITIApprenticeshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITIApprenticeshipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIApprenticeshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
