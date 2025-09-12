import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectAdmissionApplyComponent } from './direct-admission-apply.component';

describe('DirectAdmissionApplyComponent', () => {
  let component: DirectAdmissionApplyComponent;
  let fixture: ComponentFixture<DirectAdmissionApplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DirectAdmissionApplyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectAdmissionApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
