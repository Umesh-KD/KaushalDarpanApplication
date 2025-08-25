import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampusValidationComponent } from './iticampus-validation.component';

describe('CampusValidationComponent', () => {
  let component: CampusValidationComponent;
  let fixture: ComponentFixture<CampusValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CampusValidationComponent]
    });
    fixture = TestBed.createComponent(CampusValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
