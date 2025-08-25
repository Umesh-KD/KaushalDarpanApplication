import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchPrincipalRevalGroupCodeFormComponent } from './DispatchPrincipalRevalGroupCode-form.component';

describe('QualificationFormComponent', () => {
  let component: DispatchPrincipalRevalGroupCodeFormComponent;
  let fixture: ComponentFixture<DispatchPrincipalRevalGroupCodeFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DispatchPrincipalRevalGroupCodeFormComponent]
    });
    fixture = TestBed.createComponent(DispatchPrincipalRevalGroupCodeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
