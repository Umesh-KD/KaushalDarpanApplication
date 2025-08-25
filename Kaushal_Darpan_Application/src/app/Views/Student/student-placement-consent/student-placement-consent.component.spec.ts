import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPlacementConsentComponent } from './student-placement-consent.component';

describe('StudentPlacementConsentComponent', () => {
  let component: StudentPlacementConsentComponent;
  let fixture: ComponentFixture<StudentPlacementConsentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentPlacementConsentComponent]
    });
    fixture = TestBed.createComponent(StudentPlacementConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
