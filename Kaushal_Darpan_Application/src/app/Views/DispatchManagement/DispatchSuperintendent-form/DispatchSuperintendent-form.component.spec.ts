import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchSuperintendentFormComponent } from './DispatchSuperintendent-form.component';

describe('QualificationFormComponent', () => {
  let component: DispatchSuperintendentFormComponent;
  let fixture: ComponentFixture<DispatchSuperintendentFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DispatchSuperintendentFormComponent]
    });
    fixture = TestBed.createComponent(DispatchSuperintendentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
