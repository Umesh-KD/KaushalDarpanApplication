import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JailAdmissionApplyComponent } from './jail-admission-apply.component';

describe('JailAdmissionApplyComponent', () => {
  let component: JailAdmissionApplyComponent;
  let fixture: ComponentFixture<JailAdmissionApplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JailAdmissionApplyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JailAdmissionApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
