import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrMasterValidationComponent } from './itihr-master-validation.component';

describe('HrMasterValidationComponent', () => {
  let component: HrMasterValidationComponent;
  let fixture: ComponentFixture<HrMasterValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrMasterValidationComponent]
    });
    fixture = TestBed.createComponent(HrMasterValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
