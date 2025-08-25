import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchPrincipalGroupCodeFormComponent } from './DispatchPrincipalGroupCode-form.component';

describe('QualificationFormComponent', () => {
  let component: DispatchPrincipalGroupCodeFormComponent;
  let fixture: ComponentFixture<DispatchPrincipalGroupCodeFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DispatchPrincipalGroupCodeFormComponent]
    });
    fixture = TestBed.createComponent(DispatchPrincipalGroupCodeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
