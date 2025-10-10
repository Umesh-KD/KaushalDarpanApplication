import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiCampusValidationComponent } from './iticampus-validation.component';

describe('ItiCampusValidationComponent', () => {
  let component: ItiCampusValidationComponent;
  let fixture: ComponentFixture<ItiCampusValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItiCampusValidationComponent]
    });
    fixture = TestBed.createComponent(ItiCampusValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
