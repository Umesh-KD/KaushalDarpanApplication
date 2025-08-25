import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyValidationComponent } from './company-validation.component';

describe('CompanyValidationComponent', () => {
  let component: CompanyValidationComponent;
  let fixture: ComponentFixture<CompanyValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyValidationComponent]
    });
    fixture = TestBed.createComponent(CompanyValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
