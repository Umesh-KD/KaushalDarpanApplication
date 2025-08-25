import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIStudentPlacementConsentComponent } from './iti-student-placement-consent.component';

describe('ITIStudentPlacementConsentComponent', () => {
  let component: ITIStudentPlacementConsentComponent;
  let fixture: ComponentFixture<ITIStudentPlacementConsentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ITIStudentPlacementConsentComponent]
    });
    fixture = TestBed.createComponent(ITIStudentPlacementConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
